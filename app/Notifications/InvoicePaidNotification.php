<?php

namespace App\Notifications;

use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoicePaidNotification extends Notification
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
        $this->invoice->load(['customer.user', 'customer.package', 'payments']);

        // Generate PDF in memory
        $pdf = Pdf::loadView('reports.single_invoice', ['invoice' => $this->invoice]);
        $pdfData = $pdf->output();

        $payment = $this->invoice->payments->first();
        $paymentMethod = $payment ? strtoupper($payment->payment_method) : 'MANUAL';

        return (new MailMessage)
            ->subject('Pembayaran Sukses - Tagihan Lunas - ' . $this->invoice->invoice_number)
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Pembayaran tagihan internet Anda untuk periode ini telah sukses kami terima.')
            ->line('Nomor Tagihan: ' . $this->invoice->invoice_number)
            ->line('Jumlah: Rp ' . number_format($this->invoice->amount, 0, ',', '.'))
            ->line('Metode Pembayaran: ' . $paymentMethod)
            ->line('Status Tagihan: LUNAS / PAID')
            ->action('Lihat Detail Tagihan', $url)
            ->line('Terima kasih atas pembayaran Anda. Berkas kwitansi resmi lunas telah dilampirkan pada email ini.')
            ->line('Terima kasih telah setia menggunakan layanan Idrisiyyah Net!')
            ->attachData($pdfData, 'kwitansi_' . $this->invoice->invoice_number . '.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
