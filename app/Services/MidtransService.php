<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use App\Models\Invoice;
use Exception;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    public function getSnapToken(Invoice $invoice, $paymentMethod = null, $adminFee = 0)
    {
        $totalAmount = (int) $invoice->amount + (int) $adminFee;

        $params = [
            'transaction_details' => [
                'order_id' => $invoice->invoice_number . '-' . time(),
                'gross_amount' => $totalAmount,
            ],
            'customer_details' => [
                'first_name' => $invoice->customer->user->name,
                'email' => $invoice->customer->user->email,
                'phone' => $invoice->customer->phone,
            ],
            'item_details' => [
                [
                    'id' => 'PKG-' . $invoice->id,
                    'price' => (int) $invoice->amount,
                    'quantity' => 1,
                    'name' => 'Paket Internet: ' . $invoice->customer->package->name,
                ],
            ],
        ];

        if ($adminFee > 0) {
            $params['item_details'][] = [
                'id' => 'FEE-' . $invoice->id,
                'price' => (int) $adminFee,
                'quantity' => 1,
                'name' => 'Biaya Admin',
            ];
        }

        // Limit to selected payment method if provided
        if ($paymentMethod) {
            $params['enabled_payments'] = [$paymentMethod];
        }

        return Snap::getSnapToken($params);
    }
}
