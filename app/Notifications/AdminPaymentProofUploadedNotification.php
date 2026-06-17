<?php

namespace App\Notifications;

use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class AdminPaymentProofUploadedNotification extends Notification
{
    use Queueable;

    protected $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function via($notifiable): array
    {
        if (Setting::getValue('enable_email_notifications', 'yes') !== 'yes') {
            return [];
        }
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $customerName = $this->invoice->customer->user->name ?? 'Pelanggan';
        $invoiceNumber = $this->invoice->invoice_number;
        $amount = number_format($this->invoice->amount, 0, ',', '.');
        $dueDate = $this->invoice->due_date ? $this->invoice->due_date->format('d M Y') : '-';

        $mailMessage = (new MailMessage)
            ->subject("Bukti Pembayaran Baru: Tagihan {$invoiceNumber}")
            ->greeting("Halo Admin,")
            ->line("Pelanggan **{$customerName}** telah mengunggah bukti pembayaran untuk invoice berikut:")
            ->line("**Nomor Invoice:** {$invoiceNumber}")
            ->line("**Jumlah Tagihan:** Rp {$amount}")
            ->line("**Jatuh Tempo:** {$dueDate}")
            ->action('Lihat Detail Invoice', route('login'))
            ->line('Silakan login ke panel admin untuk memverifikasi pembayaran ini.');

        // Attach payment proof if it exists
        if ($this->invoice->payment_proof && Storage::disk('public')->exists($this->invoice->payment_proof)) {
            $path = Storage::disk('public')->path($this->invoice->payment_proof);
            $mailMessage->attach($path, [
                'as' => 'bukti_pembayaran_' . $invoiceNumber . '.' . pathinfo($path, PATHINFO_EXTENSION),
            ]);
        }

        return $mailMessage;
    }
}
