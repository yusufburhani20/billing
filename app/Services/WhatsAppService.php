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
     * Kirim pesan WhatsApp via Gateway Lokal (PM2) dengan Proteksi Anti-Blokir
     */
    public function sendMessage($target, $message)
    {
        // 1. Cek apakah notifikasi WA aktif di Pengaturan
        if (Setting::getValue('enable_wa_notifications', 'yes') !== 'yes') {
            \Log::info('Notifikasi WhatsApp dinonaktifkan via Pengaturan.');
            return false;
        }

        try {
            // 2. Bersihkan & Standarisasi format nomor HP (Ubah 08... menjadi 628...)
            $target = preg_replace('/[^0-9]/', '', $target);
            if (str_starts_with($target, '0')) {
                $target = '62' . substr($target, 1);
            }

            // 3. Tambahkan jeda anti-spam acak (0.5 - 1.5 detik) untuk menyimulasi ketikan manusia
            usleep(rand(500000, 1500000));

            // 4. Tambahkan jejak kaki unik (Unique Footprint) di setiap pesan agar aman dari deteksi spam Meta
            $refId = strtoupper(substr(md5(uniqid()), 0, 6));
            $message .= "\n\n_Ref ID: {$refId}_";

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
