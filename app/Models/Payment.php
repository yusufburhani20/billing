<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'transaction_id',
        'amount',
        'fee',
        'method',
        'status',
        'proof_path',
        'raw_response',
        'confirmed_at',
    ];

    protected $casts = [
        'raw_response' => 'array',
        'confirmed_at' => 'datetime',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
