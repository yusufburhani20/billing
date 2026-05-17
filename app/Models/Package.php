<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'name',
        'price',
        'registration_fee',
        'mikrotik_profile_id',
        'description',
        'is_active',
    ];

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function mikrotikProfile()
    {
        return $this->belongsTo(MikrotikProfile::class);
    }
}
