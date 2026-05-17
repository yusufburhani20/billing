<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected static function booted()
    {
        static::creating(function ($ticket) {
            if (empty($ticket->ticket_number)) {
                $datePrefix = 'TKT-' . date('Ymd');
                $lastTicket = self::where('ticket_number', 'like', $datePrefix . '%')
                                   ->orderBy('ticket_number', 'desc')
                                   ->first();

                if ($lastTicket) {
                    $lastNumber = (int) substr($lastTicket->ticket_number, -3);
                    $nextNumber = $lastNumber + 1;
                } else {
                    $nextNumber = 1;
                }

                $ticket->ticket_number = $datePrefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    protected $fillable = [
        'ticket_number',
        'customer_id',
        'subject',
        'description',
        'priority',
        'status',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function messages()
    {
        return $this->hasMany(TicketMessage::class);
    }
}
