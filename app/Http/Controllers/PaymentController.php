<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Customer;
use App\Notifications\InvoicePaidNotification;
use App\Services\MidtransService;
use App\Services\MikrotikService;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $midtrans;
    protected $mikrotik;
    protected $wa;

    public function __construct(MidtransService $midtrans, MikrotikService $mikrotik, WhatsAppService $wa)
    {
        $this->midtrans = $midtrans;
        $this->mikrotik = $mikrotik;
        $this->wa = $wa;
    }

    /**
     * Get Snap Token for payment
     */
    public function getSnapToken(Request $request, Invoice $invoice)
    {
        $invoice->load(['customer.user', 'customer.package']);
        
        $paymentMethod = $request->input('payment_method');
        $adminFee = $request->input('admin_fee', 0);

        try {
            $token = $this->midtrans->getSnapToken($invoice, $paymentMethod, $adminFee);
            return response()->json(['token' => $token]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle Midtrans Callback
     */
    public function callback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $orderIdParts = explode('-', $request->order_id);
        $invoiceNumber = $orderIdParts[0] . '-' . $orderIdParts[1];
        
        $invoice = Invoice::where('invoice_number', $invoiceNumber)->first();

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        $status = $request->transaction_status;

        if ($status == 'settlement' || $status == 'capture') {
            $invoice->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            Payment::create([
                'invoice_id' => $invoice->id,
                'amount' => $invoice->amount,
                'payment_method' => $request->payment_type,
                'status' => 'success',
                'reference' => $request->transaction_id,
            ]);

            // AUTO RECONNECT CUSTOMER ON MIKROTIK
            $customer = Customer::with(['user', 'package', 'router'])->find($invoice->customer_id);
            if ($customer && $customer->router) {
                $customer->update(['status' => 'active']);
                
                // Ensure secret exists in Mikrotik before trying to reconnect/unisolate
                $this->mikrotik->syncSecret($customer->router, [
                    'username' => $customer->pppoe_username,
                    'password' => $customer->pppoe_password,
                    'profile' => $customer->package->mikrotikProfile->name ?? 'default',
                    'full_name' => $customer->user->name
                ]);

                $this->mikrotik->reconnect($customer->router, $customer->pppoe_username);
            }

            // SEND WA NOTIFICATION
            if ($customer && $customer->phone) {
                $appName = \App\Models\Setting::getValue('app_name', 'Idrisiyyah Net');
                $message = "Terima kasih *{$customer->user->name}*,\n\n" .
                           "Pembayaran tagihan #{$invoice->invoice_number} sebesar *Rp " . number_format($invoice->amount, 0, ',', '.') . "* telah kami terima.\n\n" .
                           "Layanan internet Anda telah aktif kembali. Selamat berinternet!\n\n" .
                           "-- {$appName} --";
                $this->wa->sendMessage($customer->phone, $message);
            }

            // SEND EMAIL NOTIFICATION
            if ($customer && $customer->user && $customer->user->email) {
                try {
                    $customer->user->notify(new InvoicePaidNotification($invoice));
                } catch (\Exception $e) {
                    Log::error('Error sending callback paid invoice email: ' . $e->getMessage());
                }
            }

            Log::info("Payment success for Invoice: " . $invoice->invoice_number);
        }

        return response()->json(['message' => 'Callback processed']);
    }
}
