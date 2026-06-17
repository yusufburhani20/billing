<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $customer = auth()->user()->customer;
        
        if (!$customer) {
            return redirect()->route('dashboard')->with('error', 'Customer profile not found.');
        }

        return Inertia::render('Customer/Invoices/Index', [
            'invoices' => Invoice::where('customer_id', $customer->id)->latest()->get()
        ]);
    }

    public function uploadProof(Request $request, Invoice $invoice)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('payment_proof')) {
            // Store payment proof in storage/app/public/payment_proofs
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            // Delete old proof file if exists
            if ($invoice->payment_proof) {
                Storage::disk('public')->delete($invoice->payment_proof);
            }

            $invoice->update([
                'payment_proof' => $path,
            ]);

            // 1. Send WA notification to admin_wa
            $adminWa = \App\Models\Setting::getValue('admin_wa');
            $customerName = $invoice->customer->user->name ?? 'Pelanggan';
            $amountFormatted = number_format($invoice->amount, 0, ',', '.');
            
            $waMessage = "🚨 *Bukti Transfer Baru Diunggah*\n\n" .
                         "Pelanggan *{$customerName}* telah mengunggah bukti pembayaran.\n\n" .
                         "📄 *No. Invoice:* {$invoice->invoice_number}\n" .
                         "💰 *Jumlah:* Rp {$amountFormatted}\n" .
                         "📅 *Jatuh Tempo:* " . ($invoice->due_date ? $invoice->due_date->format('d M Y') : '-') . "\n\n" .
                         "Silakan login ke panel admin untuk memverifikasi:\n" . route('login');

            if ($adminWa) {
                \App\Jobs\SendWhatsAppMessageJob::dispatch($adminWa, $waMessage);
            }

            // 2. Send Email notification to admin_email
            $adminEmail = \App\Models\Setting::getValue('admin_email');
            if ($adminEmail) {
                // Dispatch as a background job using queued notification to a named email
                \App\Jobs\SendAdminPaymentProofEmailJob::dispatch($invoice->id, $adminEmail);
            } else {
                // Fallback: dispatch notification to each admin user
                $admins = \App\Models\User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    $admin->notify(new \App\Notifications\AdminPaymentProofUploadedNotification($invoice));
                }
            }

            return redirect()->back()->with('message', 'Bukti transfer berhasil diunggah. Menunggu verifikasi admin.');
        }

        return redirect()->back()->with('error', 'Gagal mengunggah bukti transfer.');
    }
}
