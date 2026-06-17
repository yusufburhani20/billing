<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Jobs\SendWhatsAppMessageJob;

class TicketController extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        $customer = auth()->user()->customer;
        
        if (!$customer) {
            return redirect()->route('customer.dashboard')->with('error', 'Customer profile not found.');
        }

        return Inertia::render('Customer/Tickets/Index', [
            'tickets' => Ticket::where('customer_id', $customer->id)->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        $customer = auth()->user()->customer;

        $ticket = Ticket::create([
            'customer_id' => $customer->id,
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'status' => 'open',
        ]);

        $delay = 0;
        foreach ($admins as $admin) {
            // Send Email Notification
            if ($admin->email) {
                $admin->notify(new \App\Notifications\AdminTicketCreatedNotification($ticket));
            }

            // Send WA Notification
            if ($admin->phone) {
                $message = "🚨 *Laporan Gangguan Baru*\n\n" .
                           "Halo Admin {$admin->name},\n" .
                           "Ada laporan gangguan baru dari pelanggan.\n\n" .
                           "👤 *Pelanggan:* " . auth()->user()->name . "\n" .
                           "🎫 *No Tiket:* #{$ticket->ticket_number}\n" .
                           "🔴 *Prioritas:* " . strtoupper($ticket->priority) . "\n" .
                           "📌 *Subjek:* {$ticket->subject}\n" .
                           "📝 *Deskripsi:*\n{$ticket->description}\n\n" .
                           "Segera login untuk memproses keluhan ini:\n" . route('login');

                SendWhatsAppMessageJob::dispatch($admin->phone, $message)->delay(now()->addSeconds($delay));
                $delay += 2;
            }
        }

        return redirect()->route('customer.tickets.index')->with('message', 'Ticket created successfully.');
    }

    public function show(Ticket $ticket)
    {
        // Ensure user owns the ticket
        if ($ticket->customer_id !== auth()->user()->customer->id) {
            abort(403);
        }

        return Inertia::render('Customer/Tickets/Show', [
            'ticket' => $ticket->load(['messages.user', 'customer.user'])
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        if ($ticket->customer_id !== auth()->user()->customer->id) {
            abort(403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $validated['message'],
        ]);

        return redirect()->back()->with('message', 'Reply sent.');
    }
}
