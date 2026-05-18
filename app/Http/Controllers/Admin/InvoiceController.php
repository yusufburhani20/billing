<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Payment;
use App\Services\WhatsAppService;
use App\Services\MikrotikService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

use App\Notifications\InvoiceCreatedNotification;
use Illuminate\Support\Facades\Notification;

class InvoiceController extends Controller
{
    protected $wa;
    protected $mikrotik;

    public function __construct(WhatsAppService $wa, MikrotikService $mikrotik)
    {
        $this->wa = $wa;
        $this->mikrotik = $mikrotik;
    }

    public function index()
    {
        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => Invoice::with(['customer.user', 'customer.package', 'customer.router', 'payments'])->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);

        $customer = Customer::with(['package', 'user'])->find($validated['customer_id']);
        
        // Check if invoice already exists for this month/year
        $exists = Invoice::where('customer_id', $customer->id)
            ->whereMonth('created_at', $validated['month'])
            ->whereYear('created_at', $validated['year'])
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors(['message' => 'Tagihan untuk bulan ini sudah ada.']);
        }

        $invoice = Invoice::create([
            'customer_id' => $customer->id,
            'amount' => $customer->package->price,
            'status' => 'unpaid',
            'due_date' => now()->setDay(20)->startOfDay(),
        ]);

        // 1. KIRIM NOTIFIKASI EMAIL
        if ($customer->user && $customer->user->email) {
            $customer->user->notify(new InvoiceCreatedNotification($invoice));
        }

        // 2. KIRIM NOTIFIKASI WHATSAPP
        if ($customer->phone) {
            $message = "Halo *{$customer->user->name}*,\n\n" .
                       "Tagihan internet Anda telah terbit.\n" .
                       "Nomor: #{$invoice->invoice_number}\n" .
                       "Jumlah: *Rp " . number_format($invoice->amount, 0, ',', '.') . "*\n" .
                       "Jatuh Tempo: *{$invoice->due_date->format('d F Y')}*\n\n" .
                       "Silakan lakukan pembayaran melalui portal pelanggan atau hubungi admin.\n\n" .
                       "-- Idrisiyyah Net --";
            $this->wa->sendMessage($customer->phone, $message);
        }

        return redirect()->back()->with('message', 'Tagihan berhasil dibuat dan dikirim.');
    }

    public function markAsPaid(Invoice $invoice)
    {
        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        Payment::create([
            'invoice_id' => $invoice->id,
            'amount' => $invoice->amount,
            'payment_method' => 'manual',
            'status' => 'success',
            'reference' => 'MANUAL-' . auth()->id(),
        ]);

        $customer = Customer::with(['user', 'package', 'router'])->find($invoice->customer_id);
        
        // RECONNECT ON MIKROTIK
        if ($customer && $customer->router) {
            $customer->update(['status' => 'active']);
            
            // Ensure secret exists in Mikrotik before trying to reconnect/unisolate
            $this->mikrotik->syncSecret($customer->router, [
                'username' => $customer->pppoe_username,
                'password' => $customer->pppoe_password,
                'profile' => $customer->package->mikrotikProfile->name ?? 'default',
                'full_name' => $customer->user->name
            ]);

            $this->mikrotik->reconnect($customer->router, $customer->pppoe_username);
        }

        // SEND WA CONFIRMATION
        if ($customer && $customer->phone) {
            $message = "Terima kasih *{$customer->user->name}*,\n\n" .
                       "Pembayaran tagihan #{$invoice->invoice_number} sebesar *Rp " . number_format($invoice->amount, 0, ',', '.') . "* telah kami terima.\n\n" .
                       "Layanan internet Anda telah aktif kembali. Selamat menikmati!\n\n" .
                       "-- Idrisiyyah Net --";
            $this->wa->sendMessage($customer->phone, $message);
        }

        return redirect()->back()->with('message', 'Tagihan dikonfirmasi lunas.');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->back()->with('message', 'Tagihan dihapus.');
    }

    public function print(Invoice $invoice)
    {
        $invoice->load(['customer.user', 'customer.package', 'customer.router', 'payments']);
        
        $customer = $invoice->customer;
        $user = $customer->user;
        $package = $customer->package;
        $router = $customer->router;
        
        $payment = $invoice->payments->first();
        
        $formatted_amount = 'Rp ' . number_format($invoice->amount, 0, ',', '.');
        $formatted_created = $invoice->created_at->translatedFormat('d F Y');
        $formatted_due = $invoice->due_date->translatedFormat('d F Y');
        $formatted_paid = $invoice->paid_at ? $invoice->paid_at->translatedFormat('d F Y H:i') : null;

        $badge_class = $invoice->status === 'paid' ? 'status-paid' : 'status-unpaid';
        $status_text = $invoice->status === 'paid' ? 'LUNAS' : 'BELUM BAYAR';
        
        $router_name = $router ? $router->name : '-';
        $package_name = $package ? $package->name : 'Paket Kustom';
        $package_speed = $package ? $package->speed : '-';

        $payment_html = '';
        if ($invoice->status === 'paid' && $payment) {
            $payment_method = strtoupper($payment->payment_method);
            $payment_html = <<<HTML
        <div class="payment-info">
            <h4>Telah Dibayar Lunas</h4>
            <div class="payment-grid">
                <div>
                    <div class="info-label">Metode Pembayaran</div>
                    <div style="font-weight: 700;">{$payment_method}</div>
                </div>
                <div>
                    <div class="info-label">Referensi Transaksi</div>
                    <div style="font-family: monospace; font-weight: 700;">{$payment->reference}</div>
                </div>
                <div style="grid-column: span 2; border-top: 1px dashed #a7f3d0; padding-top: 10px; margin-top: 5px;">
                    <div class="info-label">Tanggal Pelunasan</div>
                    <div style="font-weight: 700;">{$formatted_paid}</div>
                </div>
            </div>
        </div>
HTML;
        }

        $html = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{$invoice->invoice_number} - {$user->name}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            color: #334155;
            background-color: #f8fafc;
        }
        .invoice-card {
            background: white;
            padding: 50px;
            max-width: 800px;
            margin: 0 auto;
            border-radius: 24px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }
        .logo-area h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 900;
            color: #4f46e5;
            letter-spacing: -0.05em;
            text-transform: uppercase;
        }
        .logo-area p {
            margin: 4px 0 0 0;
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            color: #1e293b;
        }
        .status-badge {
            display: inline-block;
            margin-top: 8px;
            padding: 6px 14px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            border-radius: 9999px;
            letter-spacing: 0.05em;
        }
        .status-paid {
            background-color: #ecfdf5;
            color: #059669;
        }
        .status-unpaid {
            background-color: #fffbeb;
            color: #d97706;
        }
        .grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        .section-title {
            font-size: 10px;
            font-weight: 900;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .info-item {
            margin-bottom: 12px;
        }
        .info-label {
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
        }
        .info-value {
            font-size: 13px;
            font-weight: 700;
            color: #334155;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .table th {
            text-align: left;
            padding: 12px;
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #e2e8f0;
        }
        .table td {
            padding: 20px 12px;
            font-size: 13px;
            font-weight: 700;
            border-bottom: 1px solid #f1f5f9;
        }
        .total-area {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 20px 12px;
            background-color: #f8fafc;
            border-radius: 16px;
            margin-bottom: 40px;
        }
        .total-label {
            font-size: 12px;
            font-weight: 800;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-right: 20px;
        }
        .total-val {
            font-size: 20px;
            font-weight: 900;
            color: #4f46e5;
        }
        .payment-info {
            background-color: #ecfdf5;
            border: 1px solid #a7f3d0;
            padding: 20px;
            border-radius: 16px;
            font-size: 12px;
            max-width: 800px;
            margin: 0 auto;
        }
        .payment-info h4 {
            margin: 0 0 10px 0;
            color: #065f46;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
        }
        .payment-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 15px;
        }
        .print-btn-area {
            max-width: 800px;
            margin: 20px auto 0 auto;
            display: flex;
            justify-content: flex-end;
        }
        .btn {
            background-color: #4f46e5;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }
        .btn:hover {
            background-color: #4338ca;
        }
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .invoice-card {
                border: none;
                box-shadow: none;
                padding: 0;
            }
            .print-btn-area {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-card">
        <div class="header">
            <div class="logo-area">
                <h1>Idrisiyyah Net</h1>
            </div>
            <div class="invoice-title">
                <h2>#{$invoice->invoice_number}</h2>
                <span class="status-badge {$badge_class}">{$status_text}</span>
            </div>
        </div>

        <div class="grid">
            <div>
                <div class="section-title">Tagihan Kepada</div>
                <div class="info-item">
                    <div class="info-label">ID Pelanggan</div>
                    <div class="info-value">{$customer->customer_code}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Nama Pelanggan</div>
                    <div class="info-value">{$user->name}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Alamat Pemasangan</div>
                    <div class="info-value">{$customer->address}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">No. Telepon / WA</div>
                    <div class="info-value">{$customer->phone}</div>
                </div>
            </div>
            <div>
                <div class="section-title">Rincian Invoice</div>
                <div class="info-item">
                    <div class="info-label">Tanggal Terbit</div>
                    <div class="info-value">{$formatted_created}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Jatuh Tempo</div>
                    <div class="info-value">{$formatted_due}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">PPPoE Username</div>
                    <div class="info-value">{$customer->pppoe_username}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Lokasi Router</div>
                    <div class="info-value">{$router_name}</div>
                </div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Deskripsi Layanan</th>
                    <th style="text-align: right;">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Paket Internet: <span style="color: #1e293b;">{$package_name}</span> ({$package_speed})</td>
                    <td style="text-align: right;">{$formatted_amount}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-area">
            <span class="total-label">Total Tagihan</span>
            <span class="total-val">{$formatted_amount}</span>
        </div>

        {$payment_html}
    </div>

    <div class="print-btn-area">
        <button class="btn" onclick="window.print()">Cetak Invoice</button>
    </div>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.print();
            }, 500);
        });
    </script>
</body>
</html>
HTML;

        return response($html);
    }

    public function sendWhatsapp(Invoice $invoice)
    {
        $invoice->load(['customer.user', 'customer.package']);
        $customer = $invoice->customer;

        if (!$customer || !$customer->phone) {
            return redirect()->back()->with('error', 'Nomor WhatsApp pelanggan tidak ditemukan.');
        }

        if ($invoice->status === 'paid') {
            $message = "Halo *{$customer->user->name}*,\n\n" .
                       "Pembayaran tagihan internet **Idrisiyyah Net** #{$invoice->invoice_number} sebesar *Rp " . number_format($invoice->amount, 0, ',', '.') . "* telah kami terima.\n\n" .
                       "Layanan internet Anda aktif secara normal. Terima kasih atas kepercayaan Anda!\n\n" .
                       "-- Idrisiyyah Net --";
        } else {
            $message = "Halo *{$customer->user->name}*,\n\n" .
                       "Ini adalah pengingat tagihan internet **Idrisiyyah Net** Anda yang belum terbayar.\n\n" .
                       "📌 *Detail Tagihan:*\n" .
                       "• No. Invoice: #{$invoice->invoice_number}\n" .
                       "• Jumlah: Rp " . number_format($invoice->amount, 0, ',', '.') . "\n" .
                       "• Jatuh Tempo: " . $invoice->due_date->format('d M Y') . "\n\n" .
                       "Silakan lakukan pembayaran melalui portal pelanggan kami:\n" .
                       route('login') . "\n\n" .
                       "Terima kasih.";
        }

        $sent = $this->wa->sendMessage($customer->phone, $message);

        if ($sent) {
            return redirect()->back()->with('message', 'Notifikasi WhatsApp berhasil dikirim ke pelanggan.');
        }

        return redirect()->back()->with('error', 'Gagal mengirim pesan WhatsApp. Pastikan gateway WA aktif.');
    }

    public function sendEmail(Invoice $invoice)
    {
        $invoice->load(['customer.user']);
        $customer = $invoice->customer;

        if (!$customer || !$customer->user || !$customer->user->email) {
            return redirect()->back()->with('error', 'Alamat email pelanggan tidak ditemukan.');
        }

        try {
            $customer->user->notify(new InvoiceCreatedNotification($invoice));
            return redirect()->back()->with('message', 'Notifikasi Email berhasil dikirim ke pelanggan.');
        } catch (\Exception $e) {
            \Log::error('Error sending invoice email: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengirim email: ' . $e->getMessage());
        }
    }
}
