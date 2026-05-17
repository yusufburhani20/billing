<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceCreatedNotification extends Notification
{
    use Queueable;

    protected $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $url = route('customer.invoices.index');

        return (new MailMessage)
            ->subject('Tagihan Internet Baru - ' . $this->invoice->invoice_number)
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Tagihan internet Anda untuk periode ini telah terbit.')
            ->line('Nomor Tagihan: ' . $this->invoice->invoice_number)
            ->line('Jumlah: Rp ' . number_format($this->invoice->amount, 0, ',', '.'))
            ->line('Jatuh Tempo: ' . $this->invoice->due_date->format('d F Y'))
            ->action('Lihat Tagihan & Bayar', $url)
            ->line('Mohon lakukan pembayaran sebelum tanggal jatuh tempo untuk menghindari isolasi layanan.')
            ->line('Terima kasih telah menggunakan layanan Idrisiyyah Net!');
    }
}
