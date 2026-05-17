<?php

namespace App\Exports;

use App\Models\Invoice;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InvoicesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Invoice::with('customer.user')->latest()->get();
    }

    public function headings(): array
    {
        return [
            'Invoice Number',
            'Customer Name',
            'Amount',
            'Status',
            'Due Date',
            'Paid At',
            'Created At',
        ];
    }

    public function map($invoice): array
    {
        return [
            $invoice->invoice_number,
            $invoice->customer->user->name,
            $invoice->amount,
            strtoupper($invoice->status),
            $invoice->due_date->format('Y-m-d'),
            $invoice->paid_at ? $invoice->paid_at->format('Y-m-d H:i') : '-',
            $invoice->created_at->format('Y-m-d'),
        ];
    }
}
