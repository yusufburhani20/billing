<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\MikrotikService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PppoeController extends Controller
{
    protected $mikrotik;

    public function __construct(MikrotikService $mikrotik)
    {
        $this->mikrotik = $mikrotik;
    }

    public function index()
    {
        $customers = Customer::with(['user', 'package', 'router'])
            ->whereNotNull('pppoe_username')
            ->latest()
            ->get();

        return Inertia::render('Admin/Pppoe/Index', [
            'customers' => $customers
        ]);
    }

    public function isolate(Customer $customer)
    {
        if (!$customer->router) {
            return redirect()->back()->with('error', 'Pelanggan tidak memiliki router yang ditetapkan.');
        }

        if ($this->mikrotik->isolate($customer->router, $customer->pppoe_username)) {
            $customer->update(['status' => 'isolated']);
            return redirect()->back()->with('message', 'Pelanggan berhasil diisolir.');
        }

        return redirect()->back()->with('error', 'Gagal mengisolir pelanggan di Mikrotik.');
    }

    public function reconnect(Customer $customer)
    {
        if (!$customer->router) {
            return redirect()->back()->with('error', 'Pelanggan tidak memiliki router yang ditetapkan.');
        }

        if ($this->mikrotik->reconnect($customer->router, $customer->pppoe_username)) {
            $customer->update(['status' => 'active']);
            return redirect()->back()->with('message', 'Koneksi pelanggan berhasil dipulihkan.');
        }

        return redirect()->back()->with('error', 'Gagal memulihkan koneksi di Mikrotik.');
    }

    public function sync(Customer $customer)
    {
        if (!$customer->router) {
            return redirect()->back()->with('error', 'Pelanggan tidak memiliki router yang ditetapkan.');
        }

        $success = $this->mikrotik->syncSecret($customer->router, [
            'username' => $customer->pppoe_username,
            'password' => $customer->pppoe_password,
            'profile' => $customer->package->mikrotikProfile->name ?? 'default',
            'full_name' => $customer->user->name
        ]);

        if ($success) {
            return redirect()->back()->with('message', 'Data PPPoE berhasil disinkronkan ke Mikrotik.');
        }

        return redirect()->back()->with('error', 'Gagal sinkronisasi data ke Mikrotik.');
    }
}
