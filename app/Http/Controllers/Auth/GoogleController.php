<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Customer;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal masuk menggunakan Google: ' . $e->getMessage());
        }

        // Find existing user by email
        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Check if customer profile exists, if not create one
            if ($user->role === 'customer') {
                $customerExists = Customer::where('user_id', $user->id)->exists();
                if (!$customerExists) {
                    $pppoePassword = Str::random(6);
                    $customer = Customer::create([
                        'user_id' => $user->id,
                        'phone' => '',
                        'address' => '',
                        'pppoe_password' => $pppoePassword,
                        'status' => 'inactive',
                        'billing_date' => 1,
                    ]);
                    $customer->update([
                        'pppoe_username' => strtolower($customer->customer_code)
                    ]);
                }
            }

            Auth::login($user, true);

            // Redirect based on role
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('customer.dashboard');
        }

        // User does not exist, trigger Signup (Sign Up) Flow
        $user = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'password' => Hash::make(Str::random(16)),
            'role' => 'customer',
        ]);

        $pppoePassword = Str::random(6);
        $customer = Customer::create([
            'user_id' => $user->id,
            'phone' => '',
            'address' => '',
            'pppoe_password' => $pppoePassword,
            'status' => 'inactive',
            'billing_date' => 1,
        ]);

        $customer->update([
            'pppoe_username' => strtolower($customer->customer_code)
        ]);

        event(new Registered($user));

        Auth::login($user, true);

        return redirect()->route('customer.dashboard');
    }
}
