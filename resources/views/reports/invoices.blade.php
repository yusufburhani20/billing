<!DOCTYPE html>
<html>
<head>
    <title>Invoices Report - Idrisiyyah Net</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #4f46e5; text-transform: uppercase; }
        .header p { margin: 5px 0; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { bg-color: #f3f4f6; font-weight: bold; text-transform: uppercase; font-size: 10px; }
        .status-paid { color: green; font-weight: bold; }
        .status-unpaid { color: orange; font-weight: bold; }
        .footer { margin-top: 30px; text-align: right; font-size: 10px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Idrisiyyah Net</h1>
        <p>Laporan Rekapitulasi Tagihan Internet</p>
        <p>Tanggal Cetak: {{ now()->format('d M Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Invoice</th>
                <th>Pelanggan</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Jatuh Tempo</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoices as $invoice)
            <tr>
                <td>{{ $invoice->invoice_number }}</td>
                <td>{{ $invoice->customer->user->name }}</td>
                <td>Rp {{ number_format($invoice->amount, 0, ',', '.') }}</td>
                <td>
                    <span class="{{ $invoice->status === 'paid' ? 'status-paid' : 'status-unpaid' }}">
                        {{ strtoupper($invoice->status) }}
                    </span>
                </td>
                <td>{{ $invoice->due_date->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Dicetak otomatis oleh Sistem Billing Idrisiyyah Net
    </div>
</body>
</html>
