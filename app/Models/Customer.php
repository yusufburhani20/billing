<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected static function booted()
    {
        static::creating(function ($customer) {
            if (empty($customer->customer_code)) {
                $datePrefix = date('Ymd');
                $lastCustomer = self::where('customer_code', 'like', $datePrefix . '%')
                                    ->orderBy('customer_code', 'desc')
                                    ->first();

                if ($lastCustomer) {
                    $lastNumber = (int) substr($lastCustomer->customer_code, -3);
                    $nextNumber = $lastNumber + 1;
                } else {
                    $nextNumber = 1;
                }

                $customer->customer_code = $datePrefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    protected $fillable = [
        'customer_code',
        'user_id',
        'package_id',
        'router_id',
        'phone',
        'address',
        'pppoe_username',
        'pppoe_password',
        'billing_date',
        'status',
        'activated_at',
        'lat',
        'long',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function router()
    {
        return $this->belongsTo(Router::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
