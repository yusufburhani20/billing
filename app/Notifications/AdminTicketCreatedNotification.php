<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Ticket;
use App\Models\Setting;

class AdminTicketCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        if (Setting::getValue('enable_email_notifications', 'yes') !== 'yes') {
            return [];
        }
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $customerName = $this->ticket->customer->user->name ?? 'Customer';

        return (new MailMessage)
            ->subject("Tiket Gangguan Baru: #{$this->ticket->ticket_number} - {$this->ticket->subject}")
            ->greeting("Halo Admin {$notifiable->name},")
            ->line("Ada laporan gangguan baru dari pelanggan **{$customerName}**.")
            ->line("**Prioritas:** " . strtoupper($this->ticket->priority))
            ->line("**Deskripsi:**")
            ->line($this->ticket->description)
            ->action('Lihat Detail Tiket', route('login'))
            ->line('Segera periksa dan tanggapi keluhan pelanggan ini!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
