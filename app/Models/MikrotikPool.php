<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MikrotikPool extends Model
{
    protected $fillable = [
        'name',
        'ranges',
        'router_id',
    ];

    public function router()
    {
        return $this->belongsTo(Router::class);
    }

    public function mikrotikProfiles()
    {
        return $this->hasMany(MikrotikProfile::class);
    }
}
