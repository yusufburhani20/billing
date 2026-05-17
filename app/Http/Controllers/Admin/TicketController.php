<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => Ticket::with('customer.user')->latest()->get()
        ]);
    }

    public function show(Ticket $ticket)
    {
        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket->load(['messages.user', 'customer.user'])
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $validated['message'],
        ]);

        // Automatically mark as pending if admin replies
        if ($ticket->status === 'open') {
            $ticket->update(['status' => 'pending']);
        }

        return redirect()->back()->with('message', 'Reply sent.');
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,pending,resolved,closed',
        ]);

        $ticket->update(['status' => $validated['status']]);

        return redirect()->back()->with('message', 'Ticket status updated.');
    }
}
