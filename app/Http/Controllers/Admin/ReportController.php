<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Exports\InvoicesExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function exportExcel()
    {
        return Excel::download(new InvoicesExport, 'invoices_report_' . now()->format('Y-m-d') . '.xlsx');
    }

    public function exportPDF()
    {
        $invoices = Invoice::with('customer.user')->latest()->get();
        $pdf = Pdf::loadView('reports.invoices', compact('invoices'));
        
        return $pdf->download('invoices_report_' . now()->format('Y-m-d') . '.pdf');
    }
}
