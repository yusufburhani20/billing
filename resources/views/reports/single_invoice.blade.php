<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->invoice_number }} - Idrisiyyah Net</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; font-size: 11px; line-height: 1.5; padding: 20px; }
        .invoice-card { background: #fff; max-width: 800px; margin: 0 auto; }
        .header { margin-bottom: 25px; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; }
        .logo-area h1 { margin: 0; color: #4f46e5; font-size: 24px; font-weight: 800; text-transform: uppercase; }
        .invoice-title { text-align: right; float: right; margin-top: -35px; }
        .invoice-title h2 { margin: 0; font-size: 16px; font-weight: 800; color: #1f2937; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 8px; font-size: 9px; font-weight: bold; text-transform: uppercase; margin-top: 5px; }
        .status-paid { background-color: #ecfdf5; color: #059669; }
        .status-unpaid { background-color: #fffbeb; color: #d97706; }
        .grid { width: 100%; margin-top: 20px; margin-bottom: 30px; }
        .grid td { width: 50%; vertical-align: top; }
        .section-title { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #9ca3af; margin-bottom: 10px; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px; }
        .info-item { margin-bottom: 8px; }
        .info-label { font-weight: bold; color: #4b5563; font-size: 9px; text-transform: uppercase; }
        .info-value { color: #111827; font-size: 10px; margin-top: 2px; }
        table.items-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; }
        table.items-table th, table.items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #f3f4f6; }
        table.items-table th { background-color: #f9fafb; font-weight: bold; text-transform: uppercase; font-size: 9px; color: #4b5563; }
        table.items-table td { font-size: 10px; }
        .total-area { text-align: right; margin-top: 20px; margin-bottom: 30px; }
        .total-label { font-size: 11px; font-weight: bold; color: #4b5563; text-transform: uppercase; }
        .total-val { font-size: 16px; font-weight: 800; color: #4f46e5; margin-left: 10px; }
        .payment-info { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 12px; font-size: 10px; margin-top: 20px; }
        .payment-info h4 { margin: 0 0 5px 0; color: #111827; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .footer { text-align: center; font-size: 9px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="invoice-card">
        <div class="header">
            <div class="logo-area">
                <h1>Idrisiyyah Net</h1>
            </div>
            <div class="invoice-title">
                <h2>#{{ $invoice->invoice_number }}</h2>
                <span class="status-badge {{ $invoice->status === 'paid' ? 'status-paid' : 'status-unpaid' }}">
                    {{ $invoice->status === 'paid' ? 'LUNAS' : 'BELUM BAYAR' }}
                </span>
            </div>
        </div>

        <table class="grid">
            <tr>
                <td>
                    <div class="section-title">Tagihan Kepada</div>
                    <div class="info-item">
                        <div class="info-label">ID Pelanggan</div>
                        <div class="info-value">{{ $invoice->customer->customer_code }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Nama Pelanggan</div>
                        <div class="info-value">{{ $invoice->customer->user->name }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Alamat Pemasangan</div>
                        <div class="info-value">{{ $invoice->customer->address }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">No. Telepon / WA</div>
                        <div class="info-value">{{ $invoice->customer->phone }}</div>
                    </div>
                </td>
                <td>
                    <div class="section-title">Rincian Invoice</div>
                    <div class="info-item">
                        <div class="info-label">Tanggal Terbit</div>
                        <div class="info-value">{{ $invoice->created_at->format('d F Y') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Jatuh Tempo</div>
                        <div class="info-value">{{ $invoice->due_date->format('d F Y') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PPPoE Username</div>
                        <div class="info-value">{{ $invoice->customer->pppoe_username }}</div>
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Deskripsi Layanan</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Paket Internet: <strong>{{ $invoice->customer->package->name ?? '-' }}</strong> ({{ $invoice->customer->package->speed ?? '-' }})</td>
                    <td style="text-align: right;">Rp {{ number_format($invoice->amount, 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-area">
            <span class="total-label">Total Tagihan:</span>
            <span class="total-val">Rp {{ number_format($invoice->amount, 0, ',', '.') }}</span>
        </div>

        @if($invoice->status !== 'paid')
        <div class="payment-info">
            <h4>Panduan Pembayaran Online</h4>
            <p>Silakan lakukan login ke dashboard Member Area Idrisiyyah Net untuk menyelesaikan pembayaran dengan Transfer Bank otomatis, E-Wallet (Gopay/OVO/Dana), Alfamart/Indomaret, atau kartu debit secara instan.</p>
        </div>
        @endif

        <div class="footer">
            Invoice ini diterbitkan secara otomatis dan sah oleh Sistem Billing Idrisiyyah Net.<br>
            Terima kasih atas kepercayaan Anda menggunakan layanan kami.
        </div>
    </div>
</body>
</html>
