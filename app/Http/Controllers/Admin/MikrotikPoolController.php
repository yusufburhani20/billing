<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MikrotikPool;
use App\Services\MikrotikService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MikrotikPoolController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/MikrotikPools/Index', [
            'pools' => MikrotikPool::with('router')->latest()->get(),
            'routers' => \App\Models\Router::all()
        ]);
    }

    public function store(Request $request, MikrotikService $mikrotik)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ranges' => 'required|string',
            'router_id' => 'required|exists:routers,id',
        ]);

        $pool = MikrotikPool::create($validated);

        // Sync to Mikrotik
        if ($pool->router_id) {
            $router = \App\Models\Router::find($pool->router_id);
            $mikrotik->syncPool($router, $pool->name, $pool->ranges);
        }

        return redirect()->back()->with('message', 'IP Pool berhasil dibuat dan disinkronkan ke Mikrotik.');
    }

    public function update(Request $request, MikrotikPool $mikrotikPool, MikrotikService $mikrotik)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ranges' => 'required|string',
            'router_id' => 'required|exists:routers,id',
        ]);

        $mikrotikPool->update($validated);

        // Sync to Mikrotik
        if ($mikrotikPool->router_id) {
            $router = \App\Models\Router::find($mikrotikPool->router_id);
            $mikrotik->syncPool($router, $mikrotikPool->name, $mikrotikPool->ranges);
        }

        return redirect()->back()->with('message', 'IP Pool berhasil diperbarui dan disinkronkan ke Mikrotik.');
    }

    public function destroy(MikrotikPool $mikrotikPool)
    {
        $mikrotikPool->delete();
        return redirect()->back()->with('message', 'IP Pool berhasil dihapus dari sistem.');
    }
}
