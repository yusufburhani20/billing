<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MikrotikProfile extends Model
{
    protected $fillable = [
        'name',
        'local_address',
        'mikrotik_pool_id',
        'rate_limit',
        'router_id',
    ];

    public function router()
    {
        return $this->belongsTo(Router::class);
    }

    public function mikrotikPool()
    {
        return $this->belongsTo(MikrotikPool::class);
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }
}
