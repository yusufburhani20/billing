<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Notifications\AdminPaymentProofUploadedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class SendAdminPaymentProofEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $invoiceId;
    public $adminEmail;
    public $tries = 3;

    public function __construct(int $invoiceId, string $adminEmail)
    {
        $this->invoiceId = $invoiceId;
        $this->adminEmail = $adminEmail;
    }

    public function handle(): void
    {
        $invoice = Invoice::with(['customer.user', 'payments'])->find($this->invoiceId);

        if (!$invoice) {
            return;
        }

        // Using Notification::route() inside the queued job works correctly
        // because here we are already running inside the queue worker process
        Notification::route('mail', $this->adminEmail)
            ->notify(new AdminPaymentProofUploadedNotification($invoice));
    }
}
