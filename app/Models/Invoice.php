<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected static function booted()
    {
        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $datePrefix = 'INV-' . date('Ymd');
                $lastInvoice = self::where('invoice_number', 'like', $datePrefix . '%')
                                   ->orderBy('invoice_number', 'desc')
                                   ->first();

                if ($lastInvoice) {
                    $lastNumber = (int) substr($lastInvoice->invoice_number, -3);
                    $nextNumber = $lastNumber + 1;
                } else {
                    $nextNumber = 1;
                }

                $invoice->invoice_number = $datePrefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'amount',
        'registration_fee',
        'period_start',
        'period_end',
        'due_date',
        'status',
        'payment_proof',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
