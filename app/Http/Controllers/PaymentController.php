<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Store a newly created payment.
     */
    public function store(StorePaymentRequest $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $validated = $request->validated();

        Payment::create([
            'invoice_id' => $invoice->id,
            'user_id' => Auth::id(),
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Refresh invoice to get updated payments
        $invoice->refresh();

        // Update invoice status based on total payments
        $totalPaid = $invoice->payments()->sum('amount');
        $invoiceTotal = (float) $invoice->total;

        if ($totalPaid >= $invoiceTotal) {
            $invoice->update(['status' => 'paid']);
        } elseif ($totalPaid > 0) {
            $invoice->update(['status' => 'partially_paid']);
        }

        return redirect()->back()
            ->with('success', 'Payment recorded successfully.');
    }

    /**
     * Remove the specified payment.
     */
    public function destroy(Invoice $invoice, Payment $payment): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $payment->delete();

        // Refresh invoice to get updated payments
        $invoice->refresh();

        // Update invoice status based on remaining payments
        $totalPaid = $invoice->payments()->sum('amount');
        $invoiceTotal = (float) $invoice->total;

        if ($totalPaid >= $invoiceTotal) {
            $invoice->update(['status' => 'paid']);
        } elseif ($totalPaid > 0) {
            $invoice->update(['status' => 'partially_paid']);
        } else {
            // If no payments, revert to 'sent' status (not 'draft')
            if ($invoice->status !== 'draft') {
                $invoice->update(['status' => 'sent']);
            }
        }

        return redirect()->back()
            ->with('success', 'Payment removed successfully.');
    }
}
