<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $deployLogPath = storage_path('logs/deploy.log');
        $deployLog = file_exists($deployLogPath) ? file_get_contents($deployLogPath) : '';
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'deployLog' => $deployLog
        ]);
    }

    public function updateSystem()
    {
        set_time_limit(300);

        $deployLogPath = storage_path('logs/deploy.log');

        if (!function_exists('exec')) {
            $errorMsg = "Fungsi PHP 'exec' dinonaktifkan di server Anda. Silakan hapus 'exec' dari list 'disable_functions' di pengaturan PHP aaPanel Anda.";
            @file_put_contents($deployLogPath, "[ERROR] " . $errorMsg);
            return response()->json(['success' => false, 'message' => $errorMsg], 422);
        }

        $scriptPath = base_path('deploy.sh');

        if (!file_exists($scriptPath)) {
            $errorMsg = "Script deploy.sh tidak ditemukan di " . $scriptPath;
            @file_put_contents($deployLogPath, "[ERROR] " . $errorMsg);
            return response()->json(['success' => false, 'message' => $errorMsg], 422);
        }

        // Run the script and capture output
        $output = [];
        $resultCode = null;
        exec("bash {$scriptPath} 2>&1", $output, $resultCode);

        $outputStr = implode("\n", $output);
        @file_put_contents($deployLogPath, $outputStr);

        if ($resultCode === 0) {
            return response()->json(['success' => true, 'message' => 'Update sistem berhasil dijalankan!']);
        } else {
            return response()->json(['success' => false, 'message' => 'Update sistem gagal. Silakan cek log.'], 422);
        }
    }

    public function getDeployLog()
    {
        $deployLogPath = storage_path('logs/deploy.log');
        $log = file_exists($deployLogPath) ? file_get_contents($deployLogPath) : '';
        return response()->json(['log' => $log]);
    }

    public function update(Request $request)
    {
        $data = $request->except(['favicon']);
        
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        if ($request->hasFile('favicon')) {
            $file = $request->file('favicon');
            // Delete old favicon file if exists
            $oldFavicon = Setting::getValue('favicon');
            if ($oldFavicon && file_exists(public_path($oldFavicon)) && basename($oldFavicon) !== 'favicon.ico') {
                @unlink(public_path($oldFavicon));
            }
            
            $filename = 'favicon_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/settings'), $filename);
            
            Setting::updateOrCreate(
                ['key' => 'favicon'],
                ['value' => 'uploads/settings/' . $filename]
            );
        }

        \Illuminate\Support\Facades\Cache::forget('app_settings');

        return redirect()->back()->with('message', 'Settings updated successfully.');
    }

    public function getWhatsappStatus()
    {
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(3)->get('http://localhost:3001/status');
            if ($response->successful()) {
                return response()->json($response->json());
            }
            return response()->json(['status' => 'disconnected', 'qr' => null]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'disconnected', 'qr' => null]);
        }
    }
}
