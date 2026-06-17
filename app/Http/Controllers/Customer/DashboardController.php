<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Package;
use App\Models\Ticket;
use App\Services\WhatsAppService;
use App\Notifications\InvoiceCreatedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

use App\Jobs\SendWhatsAppMessageJob;

class DashboardController extends Controller
{
    public function __construct()
    {
    }

    public function index(Request $request)
    {
        $customer = $request->user()->customer()->with(['package', 'router'])->first();

        if (!$customer) {
            return Inertia::render('Customer/NoCustomerProfile');
        }

        $invoices = Invoice::where('customer_id', $customer->id)
            ->latest()
            ->take(5)
            ->get();

        // Fix for "Package exists but no invoice" scenario
        if ($customer->package_id && $invoices->isEmpty()) {
            $invoice = Invoice::create([
                'customer_id' => $customer->id,
                'amount' => $customer->package->price,
                'status' => 'unpaid',
                'period_start' => now()->startOfMonth(),
                'period_end' => now()->endOfMonth(),
                'due_date' => now()->setDay(20)->startOfDay(),
            ]);
            $invoices = collect([$invoice]); // Show the newly created invoice
        }

        $available_packages = Package::where('is_active', true)->get();

        return Inertia::render('Customer/Dashboard', [
            'customer' => $customer,
            'invoices' => $invoices,
        ]);
    }

    public function packages(Request $request)
    {
        $customer = $request->user()->customer()->with(['package'])->first();
        $available_packages = Package::where('is_active', true)->get();

        return Inertia::render('Customer/Packages/Index', [
            'customer' => $customer,
            'availablePackages' => $available_packages
        ]);
    }

    public function selectPackage(Request $request, \App\Services\MikrotikService $mikrotik)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id'
        ]);

        $customer = $request->user()->customer;
        $package = Package::find($request->package_id);

        // Assign the router associated with the selected package
        $routerId = $package->router_id;

        $customer->update([
            'package_id' => $package->id,
            'router_id' => $routerId,
            'status' => 'inactive'
        ]);

        $customer->refresh();

        // Auto-create PPPoE Secret in Mikrotik if router is assigned
        if ($customer->router && $customer->pppoe_username && $customer->pppoe_password) {
            $mikrotik->syncSecret($customer->router, [
                'username' => $customer->pppoe_username,
                'password' => $customer->pppoe_password,
                'profile' => $package->mikrotikProfile->name ?? 'default',
                'full_name' => $customer->user->name
            ]);
        }

        // Create initial invoice immediately
        $invoice = Invoice::create([
            'customer_id' => $customer->id,
            'amount' => $package->price,
            'status' => 'unpaid',
            'period_start' => now()->startOfMonth(),
            'period_end' => now()->endOfMonth(),
            'due_date' => now()->setDay(20)->startOfDay(),
        ]);

        // Send Email Notification
        if ($request->user() && $request->user()->email) {
            $request->user()->notify(new InvoiceCreatedNotification($invoice));
        }

        // Send WA Notification
        if ($customer->phone) {
            $appName = \App\Models\Setting::getValue('app_name', 'Idrisiyyah Net');
            $message = "Halo *{$request->user()->name}*,\n\n" .
                       "Paket *{$package->name}* berhasil dipilih.\n" .
                       "Nomor Tagihan: #{$invoice->invoice_number}\n" .
                       "Total: Rp " . number_format($invoice->amount, 0, ',', '.') . "\n\n" .
                       "Silakan lakukan pembayaran melalui link berikut agar layanan dapat segera kami aktifkan:\n" .
                       route('customer.invoices.index') . "\n\n" .
                       "Terima kasih.\n" .
                       "-- {$appName} --";
            SendWhatsAppMessageJob::dispatch($customer->phone, $message);
        }

        return redirect()->back()->with('message', 'Paket dipilih! Tagihan Anda sudah terbit, silakan lakukan pembayaran.');
    }
}
