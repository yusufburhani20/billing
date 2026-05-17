<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Services\MikrotikService;
use App\Services\WhatsAppService;

class IsolateOverdueCustomers extends Command
{
    protected $signature = 'billing:isolate';
    protected $description = 'Isolate customers with unpaid invoices past due date';

    protected $mikrotik;
    protected $wa;

    public function __construct(MikrotikService $mikrotik, WhatsAppService $wa)
    {
        parent::__construct();
        $this->mikrotik = $mikrotik;
        $this->wa = $wa;
    }

    public function handle()
    {
        $overdueInvoices = Invoice::where('status', 'unpaid')
            ->where('due_date', '<', now())
            ->get();

        $count = 0;
        foreach ($overdueInvoices as $invoice) {
            $customer = $invoice->customer;
            
            if ($customer && $customer->status !== 'isolated' && $customer->router) {
                $customer->update(['status' => 'isolated']);
                
                // Trigger Mikrotik Isolation
                $this->mikrotik->isolate($customer->router, $customer->pppoe_username);

                // SEND WA NOTIFICATION
                if ($customer->phone) {
                    $message = "⚠️ *PEMBERITAHUAN ISOLIR*\n\n" .
                               "Halo *{$customer->user->name}*,\n\n" .
                               "Layanan internet Anda untuk sementara kami nonaktifkan karena terdapat tagihan yang melewati jatuh tempo (#{$invoice->invoice_number}).\n\n" .
                               "Silakan lakukan pembayaran agar layanan otomatis aktif kembali:\n" .
                               route('login') . "\n\n" .
                               "Abaikan jika Anda sudah melakukan pembayaran.\n" .
                               "-- Idrisiyyah Net --";
                    $this->wa->sendMessage($customer->phone, $message);
                }
                
                $this->info("Isolated customer: {$customer->pppoe_username}");
                $count++;
            }
        }

        $this->info("Successfully isolated {$count} overdue customers.");
    }
}
