<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Customer;
use App\Models\Invoice;
use App\Services\WhatsAppService;
use App\Notifications\InvoiceCreatedNotification;
use Illuminate\Support\Str;

class GenerateMonthlyInvoices extends Command
{
    protected $signature = 'billing:generate';
    protected $description = 'Generate monthly invoices for customers based on their billing date';

    protected $wa;

    public function __construct(WhatsAppService $wa)
    {
        parent::__construct();
        $this->wa = $wa;
    }

    public function handle()
    {
        $today = now()->day;
        $month = now()->month;
        $year = now()->year;

        $periodStart = now()->setDate($year, $month, 1)->startOfMonth();
        $periodEnd = $periodStart->copy()->endOfMonth();
        $dueDate = $periodStart->copy()->day(20)->startOfDay();

        $customers = Customer::with(['user', 'package'])->where('billing_date', $today)
            ->where('status', '!=', 'inactive')
            ->get();

        $count = 0;
        foreach ($customers as $customer) {
            // Check if invoice already exists
            $exists = Invoice::where('customer_id', $customer->id)
                ->whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->exists();

            if (!$exists) {
                $invoice = Invoice::create([
                    'customer_id' => $customer->id,
                    'amount' => $customer->package->price ?? 0,
                    'status' => 'unpaid',
                    'period_start' => $periodStart,
                    'period_end' => $periodEnd,
                    'due_date' => $dueDate,
                ]);
                $count++;

                // SEND EMAIL NOTIFICATION
                if ($customer->user && $customer->user->email) {
                    $customer->user->notify(new InvoiceCreatedNotification($invoice));
                }

                // SEND WHATSAPP NOTIFICATION
                if ($customer->phone) {
                    $message = "Halo *{$customer->user->name}*,\n\n" .
                               "Tagihan internet **Idrisiyyah Net** Anda untuk periode ini telah terbit.\n\n" .
                               "📌 *Detail Tagihan:*\n" .
                               "• No. Invoice: #{$invoice->invoice_number}\n" .
                               "• Jumlah: Rp " . number_format($invoice->amount, 0, ',', '.') . "\n" .
                               "• Jatuh Tempo: " . $invoice->due_date->format('d M Y') . "\n\n" .
                               "Silakan lakukan pembayaran melalui portal pelanggan kami:\n" .
                               route('login') . "\n\n" .
                               "Terima kasih.";
                    
                    $this->wa->sendMessage($customer->phone, $message);
                }
            }
        }

        $this->info("Successfully generated {$count} invoices.");
    }
}
