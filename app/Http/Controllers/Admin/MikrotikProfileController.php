<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MikrotikProfile;
use App\Services\MikrotikService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MikrotikProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/MikrotikProfiles/Index', [
            'profiles' => MikrotikProfile::with(['router', 'mikrotikPool'])->latest()->get(),
            'pools' => \App\Models\MikrotikPool::all(),
            'routers' => \App\Models\Router::all()
        ]);
    }

    public function store(Request $request, MikrotikService $mikrotik)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'local_address' => 'nullable|string',
            'mikrotik_pool_id' => 'nullable|exists:mikrotik_pools,id',
            'rate_limit' => 'nullable|string',
            'router_id' => 'required|exists:routers,id',
        ]);

        $profile = MikrotikProfile::create($validated);

        // Sync to Mikrotik
        if ($profile->router_id) {
            $router = \App\Models\Router::find($profile->router_id);
            $poolName = $profile->mikrotikPool ? $profile->mikrotikPool->name : null;
            
            $mikrotik->syncProfile(
                $router, 
                $profile->name, 
                $profile->local_address, 
                $poolName, 
                $profile->rate_limit
            );
        }

        return redirect()->back()->with('message', 'Profil Mikrotik berhasil dibuat dan disinkronkan.');
    }

    public function update(Request $request, MikrotikProfile $mikrotikProfile, MikrotikService $mikrotik)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'local_address' => 'nullable|string',
            'mikrotik_pool_id' => 'nullable|exists:mikrotik_pools,id',
            'rate_limit' => 'nullable|string',
            'router_id' => 'required|exists:routers,id',
        ]);

        $mikrotikProfile->update($validated);

        // Sync to Mikrotik
        if ($mikrotikProfile->router_id) {
            $router = \App\Models\Router::find($mikrotikProfile->router_id);
            $poolName = $mikrotikProfile->mikrotikPool ? $mikrotikProfile->mikrotikPool->name : null;
            
            $mikrotik->syncProfile(
                $router, 
                $mikrotikProfile->name, 
                $mikrotikProfile->local_address, 
                $poolName, 
                $mikrotikProfile->rate_limit
            );
        }

        return redirect()->back()->with('message', 'Profil Mikrotik berhasil diperbarui dan disinkronkan.');
    }

    public function destroy(MikrotikProfile $mikrotikProfile)
    {
        $mikrotikProfile->delete();
        return redirect()->back()->with('message', 'Profil Mikrotik berhasil dihapus dari sistem.');
    }
}
