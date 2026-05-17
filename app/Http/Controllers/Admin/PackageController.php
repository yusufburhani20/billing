<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Packages/Index', [
            'packages' => Package::with('mikrotikProfile')->latest()->get(),
            'mikrotikProfiles' => \App\Models\MikrotikProfile::with('router')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'registration_fee' => 'required|numeric',
            'mikrotik_profile_id' => 'required|exists:mikrotik_profiles,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Package::create($validated);

        return redirect()->back()->with('message', 'Paket berhasil ditambahkan.');
    }

    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'registration_fee' => 'required|numeric',
            'mikrotik_profile_id' => 'required|exists:mikrotik_profiles,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $package->update($validated);

        return redirect()->back()->with('message', 'Paket berhasil diperbarui.');
    }

    public function destroy(Package $package)
    {
        $package->delete();
        return redirect()->back()->with('message', 'Package deleted successfully.');
    }
}
