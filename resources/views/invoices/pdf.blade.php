<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            padding: 40px;
        }
        .header {
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header .invoice-number {
            color: #666;
        }
        .info-section {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            table-layout: fixed;
        }
        .info-box {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .info-box:first-child {
            padding-right: 20px;
        }
        .info-box:last-child {
            padding-left: 20px;
        }
        .info-box h3 {
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 10px;
            font-weight: bold;
            margin-top: 0;
        }
        .info-box p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        thead {
            background-color: #f5f5f5;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
            color: #666;
        }
        td {
            font-size: 12px;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            margin-left: auto;
            width: 250px;
            text-align: right;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .totals-row.total {
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 16px;
        }
        .notes {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .notes h3 {
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            font-weight: bold;
            color: #22c55e;
            opacity: 0.3;
            z-index: 1000;
            pointer-events: none;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            border: 4px solid #22c55e;
            padding: 20px 40px;
            border-radius: 10px;
            background-color: rgba(34, 197, 94, 0.05);
        }
    </style>
</head>
<body>
    @if($invoice->status === 'paid')
    <div class="watermark">PAID</div>
    @endif
    <div class="header">
        <h1>INVOICE</h1>
        <p class="invoice-number">Invoice Number: {{ $invoice->invoice_number }}</p>
    </div>

    <div class="info-section">
        <div class="info-box">
            <h3 style="margin-top: 0;">Bill To:</h3>
            <p style="margin-top: 0;"><strong>{{ $invoice->customer_name }}</strong></p>
            <p>{{ $invoice->customer_email }}</p>
            @if($invoice->customer_address)
                <p>{{ $invoice->customer_address }}</p>
            @endif
        </div>
        <div class="info-box" style="text-align: right;">
            <h3 style="margin-top: 0;">Invoice Details:</h3>
            <p style="margin-top: 0;"><strong>Invoice Date:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('M d, Y') }}</p>
            <p><strong>Due Date:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th class="text-right">Price (Rs.)</th>
            </tr>
        </thead>
        <tbody>
            @if($invoice->items && count($invoice->items) > 0)
                @foreach($invoice->items as $item)
                    <tr>
                        <td>{{ $item['task_name'] ?? '-' }}</td>
                        <td>{!! $item['description'] ?? '-' !!}</td>
                        <td class="text-right">{{ number_format($item['price'], 2) }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="3" style="text-align: center; color: #999;">No items</td>
                </tr>
            @endif
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row">
            <span>Subtotal:</span>
            <span>Rs. {{ number_format($invoice->subtotal, 2) }}</span>
        </div>
        <div class="totals-row total">
            <span>Total:</span>
            <span>Rs. {{ number_format($invoice->total, 2) }}</span>
        </div>
    </div>

    @if($invoice->notes)
        <div class="notes">
            <h3>Notes:</h3>
            <p>{{ $invoice->notes }}</p>
        </div>
    @endif
</body>
</html>

