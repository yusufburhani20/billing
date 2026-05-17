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
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
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
