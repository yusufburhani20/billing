<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Router extends Model
{
    protected $fillable = [
        'name',
        'ip_address',
        'api_port',
        'username',
        'password',
        'description',
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }
}
