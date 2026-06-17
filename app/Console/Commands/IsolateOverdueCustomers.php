<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Services\MikrotikService;
use App\Jobs\SendWhatsAppMessageJob;

class IsolateOverdueCustomers extends Command
{
    protected $signature = 'billing:isolate';
    protected $description = 'Isolate customers with unpaid invoices past due date';

    protected $mikrotik;

    public function __construct(MikrotikService $mikrotik)
    {
        parent::__construct();
        $this->mikrotik = $mikrotik;
    }

    public function handle()
    {
        $overdueInvoices = Invoice::where('status', 'unpaid')
            ->where('due_date', '<', now())
            ->get();

        $count = 0;
        $waDelay = 0;
        foreach ($overdueInvoices as $invoice) {
            $customer = $invoice->customer;
            
            if ($customer && $customer->status !== 'isolated' && $customer->router) {
                $customer->update(['status' => 'isolated']);
                
                // Trigger Mikrotik Isolation
                $this->mikrotik->isolate($customer->router, $customer->pppoe_username);

                // SEND WA NOTIFICATION
                if ($customer->phone) {
                    $appName = \App\Models\Setting::getValue('app_name', 'Idrisiyyah Net');
                    $message = "⚠️ *PEMBERITAHUAN ISOLIR*\n\n" .
                               "Halo *{$customer->user->name}*,\n\n" .
                               "Layanan internet Anda untuk sementara kami nonaktifkan karena terdapat tagihan yang melewati jatuh tempo (#{$invoice->invoice_number}).\n\n" .
                               "Silakan lakukan pembayaran melalui link berikut agar layanan otomatis aktif kembali:\n" .
                               route('customer.invoices.index') . "\n\n" .
                               "Abaikan jika Anda sudah melakukan pembayaran.\n" .
                               "-- {$appName} --";
                    SendWhatsAppMessageJob::dispatch($customer->phone, $message)->delay(now()->addSeconds($waDelay));
                    $waDelay += 3;
                }
                
                $this->info("Isolated customer: {$customer->pppoe_username}");
                $count++;
            }
        }

        $this->info("Successfully isolated {$count} overdue customers.");
    }
}
