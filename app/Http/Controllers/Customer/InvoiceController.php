<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function uploadProof(Request $request, Invoice $invoice)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('payment_proof')) {
            // Store payment proof in storage/app/public/payment_proofs
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            // Delete old proof file if exists
            if ($invoice->payment_proof) {
                Storage::disk('public')->delete($invoice->payment_proof);
            }

            $invoice->update([
                'payment_proof' => $path,
            ]);

            return redirect()->back()->with('message', 'Bukti transfer berhasil diunggah. Menunggu verifikasi admin.');
        }

        return redirect()->back()->with('error', 'Gagal mengunggah bukti transfer.');
    }
}
