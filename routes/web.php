<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('customer.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Router Management
    Route::resource('routers', \App\Http\Controllers\Admin\RouterController::class);
    Route::post('routers/{router}/test', [\App\Http\Controllers\Admin\RouterController::class, 'testConnection'])->name('routers.test');

    // Package Management
    Route::resource('packages', \App\Http\Controllers\Admin\PackageController::class);

    // Mikrotik Pools Management
    Route::resource('mikrotik-pools', \App\Http\Controllers\Admin\MikrotikPoolController::class);

    // Mikrotik Profiles Management
    Route::resource('mikrotik-profiles', \App\Http\Controllers\Admin\MikrotikProfileController::class);

    // Customer Management
    Route::resource('customers', \App\Http\Controllers\Admin\CustomerController::class);

    // Invoice Management
    Route::post('invoices/bulk-generate', [\App\Http\Controllers\Admin\InvoiceController::class, 'bulkGenerate'])->name('invoices.bulk-generate');
    Route::post('invoices/bulk-whatsapp', [\App\Http\Controllers\Admin\InvoiceController::class, 'bulkSendWhatsapp'])->name('invoices.bulk-whatsapp');
    Route::post('invoices/bulk-email', [\App\Http\Controllers\Admin\InvoiceController::class, 'bulkSendEmail'])->name('invoices.bulk-email');
    Route::resource('invoices', \App\Http\Controllers\Admin\InvoiceController::class);
    Route::get('invoices/{invoice}/print', [\App\Http\Controllers\Admin\InvoiceController::class, 'print'])->name('invoices.print');
    Route::post('invoices/{invoice}/pay', [\App\Http\Controllers\Admin\InvoiceController::class, 'markAsPaid'])->name('invoices.pay');
    Route::post('invoices/{invoice}/whatsapp', [\App\Http\Controllers\Admin\InvoiceController::class, 'sendWhatsapp'])->name('invoices.whatsapp');
    Route::post('invoices/{invoice}/email', [\App\Http\Controllers\Admin\InvoiceController::class, 'sendEmail'])->name('invoices.email');

    // User Management
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);

    // Ticket Management
    Route::resource('tickets', \App\Http\Controllers\Admin\TicketController::class);
    Route::post('tickets/{ticket}/reply', [\App\Http\Controllers\Admin\TicketController::class, 'reply'])->name('tickets.reply');
    Route::patch('tickets/{ticket}/status', [\App\Http\Controllers\Admin\TicketController::class, 'updateStatus'])->name('tickets.status');

    // PPPoE Management
    Route::get('pppoe', [\App\Http\Controllers\Admin\PppoeController::class, 'index'])->name('pppoe.index');
    Route::post('pppoe/{customer}/isolate', [\App\Http\Controllers\Admin\PppoeController::class, 'isolate'])->name('pppoe.isolate');
    Route::post('pppoe/{customer}/reconnect', [\App\Http\Controllers\Admin\PppoeController::class, 'reconnect'])->name('pppoe.reconnect');
    Route::post('pppoe/{customer}/sync', [\App\Http\Controllers\Admin\PppoeController::class, 'sync'])->name('pppoe.sync');

    // Reporting
    Route::get('reports/excel', [\App\Http\Controllers\Admin\ReportController::class, 'exportExcel'])->name('reports.excel');
    Route::get('reports/pdf', [\App\Http\Controllers\Admin\ReportController::class, 'exportPDF'])->name('reports.pdf');

    // Settings
    Route::get('settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
    Route::get('settings/whatsapp-status', [\App\Http\Controllers\Admin\SettingController::class, 'getWhatsappStatus'])->name('settings.whatsapp-status');
});

// Customer Routes
Route::middleware(['auth'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Customer\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/packages', [\App\Http\Controllers\Customer\DashboardController::class, 'packages'])->name('packages');
    Route::post('/select-package', [\App\Http\Controllers\Customer\DashboardController::class, 'selectPackage'])->name('select-package');
    Route::post('/invoices/{invoice}/snap-token', [\App\Http\Controllers\PaymentController::class, 'getSnapToken'])->name('payment.snap-token');

    // Invoices
    Route::get('/invoices', [\App\Http\Controllers\Customer\InvoiceController::class, 'index'])->name('invoices.index');

    // Ticket Management
    Route::resource('tickets', \App\Http\Controllers\Customer\TicketController::class);
    Route::post('tickets/{ticket}/reply', [\App\Http\Controllers\Customer\TicketController::class, 'reply'])->name('tickets.reply');
});

// Midtrans Callback (Exempt from CSRF in bootstrap/app.php)
Route::post('/payments/callback', [\App\Http\Controllers\PaymentController::class, 'callback'])->name('payment.callback');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::get('/notifications', [App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-all-read', [App\Http\Controllers\Admin\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('/notifications/{id}/mark-read', [App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('notifications.markRead');
});

// Google OAuth Routes
Route::get('auth/google', [\App\Http\Controllers\Auth\GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [\App\Http\Controllers\Auth\GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

require __DIR__.'/auth.php';
