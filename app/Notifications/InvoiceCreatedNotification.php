<?php

namespace App\Notifications;

use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceCreatedNotification extends Notification implements ShouldQueue
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
        $url = route('customer.invoices.index');

        // Load relations explicitly to ensure perfect rendering in PDF
        $this->invoice->load(['customer.user', 'customer.package']);

        // Generate PDF in memory
        $pdf = Pdf::loadView('reports.single_invoice', ['invoice' => $this->invoice]);
        $pdfData = $pdf->output();

        $appName = Setting::getValue('app_name', 'Idrisiyyah Net');

        return (new MailMessage)
            ->subject('Tagihan Internet Baru - ' . $this->invoice->invoice_number)
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Tagihan internet Anda untuk periode ini telah terbit.')
            ->line('Nomor Tagihan: ' . $this->invoice->invoice_number)
            ->line('Jumlah: Rp ' . number_format($this->invoice->amount, 0, ',', '.'))
            ->line('Jatuh Tempo: ' . $this->invoice->due_date->format('d M Y'))
            ->action('Lihat Tagihan & Bayar', $url)
            ->line('Mohon lakukan pembayaran sebelum tanggal jatuh tempo untuk menghindari isolasi layanan.')
            ->line("Terima kasih telah menggunakan layanan {$appName}!")
            ->attachData($pdfData, 'invoice_' . $this->invoice->invoice_number . '.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
