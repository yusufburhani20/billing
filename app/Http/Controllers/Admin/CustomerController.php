<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Package;
use App\Models\Router;
use App\Models\User;
use App\Services\MikrotikService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    protected $mikrotik;

    public function __construct(MikrotikService $mikrotik)
    {
        $this->mikrotik = $mikrotik;
    }

    public function index()
    {
        return Inertia::render('Admin/Customers/Index', [
            'customers' => Customer::with(['user', 'package', 'router'])->latest()->get(),
            'packages' => Package::where('is_active', true)->get(),
            'routers' => Router::all(),
            // Only users with role customer who don't have a profile yet
            'available_users' => User::where('role', 'customer')
                ->whereDoesntHave('customer')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'package_id' => 'required|exists:packages,id',
            'router_id' => 'required|exists:routers,id',
            'pppoe_username' => 'required|string|unique:customers,pppoe_username',
            'pppoe_password' => 'required|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'billing_date' => 'required|integer|min:1|max:31',
        ]);

        $customer = Customer::create($validated);

        // Sync to Mikrotik
        $this->syncToMikrotik($customer);

        return redirect()->back()->with('message', 'Customer created and synced to Mikrotik.');
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'router_id' => 'required|exists:routers,id',
            'pppoe_username' => 'required|string|unique:customers,pppoe_username,' . $customer->id,
            'pppoe_password' => 'required|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'billing_date' => 'required|integer|min:1|max:31',
            'status' => 'required|in:active,isolated,inactive',
        ]);

        $customer->update($validated);

        // Sync to Mikrotik
        $this->syncToMikrotik($customer);

        return redirect()->back()->with('message', 'Customer updated and synced to Mikrotik.');
    }

    public function destroy(Customer $customer)
    {
        // Remove from Mikrotik
        if ($customer->router) {
            $this->mikrotik->removeSecret($customer->router, $customer->pppoe_username);
        }

        $customer->delete();
        return redirect()->back()->with('message', 'Customer deleted and removed from Mikrotik.');
    }

    protected function syncToMikrotik(Customer $customer)
    {
        $customer->load(['router', 'package', 'user']);
        
        if ($customer->router && $customer->package) {
            $this->mikrotik->syncSecret($customer->router, [
                'username' => $customer->pppoe_username,
                'password' => $customer->pppoe_password,
                'profile' => $customer->package->mikrotikProfile->name,
                'full_name' => $customer->user->name,
            ]);

            // Handle isolation status
            if ($customer->status === 'isolated') {
                $this->mikrotik->isolate($customer->router, $customer->pppoe_username);
            } else if ($customer->status === 'active') {
                $this->mikrotik->reconnect($customer->router, $customer->pppoe_username);
            }
        }
    }
}
