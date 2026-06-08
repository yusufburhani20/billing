<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Router;
use App\Services\MikrotikService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouterController extends Controller
{
    protected $mikrotik;

    public function __construct(MikrotikService $mikrotik)
    {
        $this->mikrotik = $mikrotik;
    }

    public function index()
    {
        return Inertia::render('Admin/Routers/Index', [
            'routers' => Router::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ip_address' => 'required|string|max:45',
            'api_port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if (is_null($validated['password'])) {
            $validated['password'] = '';
        }

        Router::create($validated);

        return redirect()->back()->with('message', 'Router created successfully.');
    }

    public function update(Request $request, Router $router)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ip_address' => 'required|string|max:45',
            'api_port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if (is_null($validated['password']) || $validated['password'] === '') {
            unset($validated['password']);
        }

        $router->update($validated);

        return redirect()->back()->with('message', 'Router updated successfully.');
    }

    public function destroy(Router $router)
    {
        $router->delete();
        return redirect()->back()->with('message', 'Router deleted successfully.');
    }

    public function testConnection(Router $router)
    {
        session_write_close();

        if ($this->mikrotik->connect($router)) {
            $router->update(['is_active' => true]);
            return response()->json(['status' => 'success', 'message' => 'Connection successful!']);
        }

        $router->update(['is_active' => false]);
        return response()->json(['status' => 'error', 'message' => 'Connection failed. Check IP/Port/Credentials.'], 500);
    }
}
