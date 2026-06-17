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

        static::saving(function ($customer) {
            if ($customer->isDirty('phone')) {
                $customer->phone = self::formatPhoneNumber($customer->phone);
            }
        });

        static::saved(function ($customer) {
            if ($customer->isDirty('phone') && $customer->user && $customer->user->phone !== $customer->phone) {
                $customer->user->update(['phone' => $customer->phone]);
            }
        });
    }

    public static function formatPhoneNumber($phone)
    {
        if (empty($phone)) {
            return null;
        }
        
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }
        
        if (str_starts_with($phone, '8')) {
            $phone = '62' . $phone;
        }
        
        return $phone;
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
