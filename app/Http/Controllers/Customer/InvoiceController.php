<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $customer = auth()->user()->customer;
        
        if (!$customer) {
            return redirect()->route('dashboard')->with('error', 'Customer profile not found.');
        }

        return Inertia::render('Customer/Invoices/Index', [
            'invoices' => Invoice::where('customer_id', $customer->id)->latest()->get()
        ]);
    }
}
