<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Setting;

class WhatsAppService
{
    protected $baseUrl = 'http://localhost:3001/send-message';

    public function __construct()
    {
        // Tidak perlu API Key untuk gateway lokal sementara
    }

    /**
     * Kirim pesan WhatsApp via Gateway Lokal (PM2)
     */
    public function sendMessage($target, $message)
    {
        try {
            $response = Http::post($this->baseUrl, [
                'number' => $target,
                'message' => $message,
            ]);

            if ($response->successful()) {
                return true;
            }

            \Log::error('Gagal kirim WA Lokal: ' . $response->body());
            return false;
        } catch (\Exception $e) {
            \Log::error('Error WhatsApp Local Service: ' . $e->getMessage());
            return false;
        }
    }
}
