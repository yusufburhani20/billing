<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_customers' => Customer::count(),
            'active_customers' => Customer::where('status', 'active')->count(),
            'isolated_customers' => Customer::where('status', 'isolated')->count(),
            'monthly_revenue' => Invoice::where('status', 'paid')
                ->whereMonth('paid_at', now()->month)
                ->sum('amount'),
            'pending_tickets' => Ticket::whereIn('status', ['open', 'pending'])->count(),
        ];

        $recent_invoices = Invoice::with('customer.user')->latest()->take(5)->get();
        $recent_tickets = Ticket::with('customer.user')->where('status', '!=', 'closed')->latest()->take(5)->get();

        // Revenue Chart Data (Last 6 Months)
        $revenueChart = Invoice::select(
            \DB::raw('SUM(amount) as total'),
            \DB::raw("DATE_FORMAT(paid_at, '%b') as month")
        )
        ->where('status', 'paid')
        ->whereNotNull('paid_at')
        ->where('paid_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy(\DB::raw('MIN(paid_at)'))
        ->get();

        // Daily Revenue Chart Data (Last 30 Days)
        $dailyRevenueChart = Invoice::select(
            \DB::raw('SUM(amount) as total'),
            \DB::raw("DATE_FORMAT(paid_at, '%d %b') as label")
        )
        ->where('status', 'paid')
        ->whereNotNull('paid_at')
        ->where('paid_at', '>=', now()->subDays(30))
        ->groupBy('label')
        ->orderBy(\DB::raw('MIN(paid_at)'))
        ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_invoices' => $recent_invoices,
            'recent_tickets' => $recent_tickets,
            'revenue_chart' => $revenueChart,
            'daily_revenue_chart' => $dailyRevenueChart
        ]);
    }
}
