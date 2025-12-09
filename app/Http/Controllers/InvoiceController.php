<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $invoices = Invoice::where('user_id', Auth::id())
            ->latest()
            ->paginate(15);

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $customers = \App\Models\Customer::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        $projects = \App\Models\Project::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return Inertia::render('invoices/create', [
            'customers' => $customers,
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $invoiceNumber = 'INV-'.str_pad(
            (Invoice::where('user_id', Auth::id())->count() + 1),
            7,
            '0',
            STR_PAD_LEFT
        );

        $validated = $request->validated();
        
        // If items is a JSON string, decode it
        if (isset($validated['items']) && is_string($validated['items'])) {
            $validated['items'] = json_decode($validated['items'], true);
        }
        
        // If customer_id is provided, fetch customer details
        if (isset($validated['customer_id']) && $validated['customer_id']) {
            $customer = \App\Models\Customer::find($validated['customer_id']);
            if ($customer && $customer->user_id === Auth::id()) {
                $validated['customer_name'] = $customer->name;
                $validated['customer_email'] = $customer->email;
                $validated['customer_address'] = $customer->address;
            }
        }

        // Ensure items is an array
        if (isset($validated['items']) && is_array($validated['items'])) {
            $items = $validated['items'];
        } else {
            $items = [];
        }

        $invoice = Invoice::create([
            'user_id' => Auth::id(),
            'invoice_number' => $invoiceNumber,
            ...$validated,
            'items' => $items, // Ensure items is saved as array
        ]);

        // Mark tasks as paid if invoice status is paid
        if ($invoice->status === 'paid' && !empty($items)) {
            foreach ($items as $item) {
                if (isset($item['task_id'])) {
                    \App\Models\Task::where('id', $item['task_id'])
                        ->where('user_id', Auth::id())
                        ->update(['status' => 'paid']);
                }
            }
        }

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        // Enhance items with task_name and task_type if missing but task_id exists
        $items = $invoice->items ?? [];
        if (!empty($items)) {
            foreach ($items as &$item) {
                if (isset($item['task_id'])) {
                    $task = \App\Models\Task::find($item['task_id']);
                    if ($task) {
                        if (!isset($item['task_name'])) {
                            $item['task_name'] = $task->name;
                        }
                        if (!isset($item['task_type'])) {
                            $item['task_type'] = $task->type;
                        }
                    }
                }
            }
            unset($item); // Break reference
            $invoice->items = $items;
        }

        $invoice->load(['user', 'payments']);
        
        // Calculate total paid and remaining amount
        $totalPaid = $invoice->payments()->sum('amount');
        $invoice->total_paid = (float) $totalPaid;
        $invoice->remaining_amount = max(0, (float) $invoice->total - $totalPaid);

        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice): Response
    {
        $this->authorize('update', $invoice);

        $projects = \App\Models\Project::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        $customers = \App\Models\Customer::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
            'projects' => $projects,
            'customers' => $customers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $validated = $request->validated();
        
        // Ensure items is an array
        if (isset($validated['items']) && is_array($validated['items'])) {
            $items = $validated['items'];
        } else {
            $items = $invoice->items ?? [];
        }

        $invoice->update([
            ...$validated,
            'items' => $items, // Ensure items is saved as array
        ]);

        // Mark tasks as paid if invoice status is paid
        if ($invoice->status === 'paid' && !empty($items)) {
            foreach ($items as $item) {
                if (isset($item['task_id'])) {
                    \App\Models\Task::where('id', $item['task_id'])
                        ->where('user_id', Auth::id())
                        ->update(['status' => 'paid']);
                }
            }
        }

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice): RedirectResponse
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    /**
     * Export the invoice as PDF.
     */
    public function pdf(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        // Enhance items with task_name and task_type if missing but task_id exists
        $items = $invoice->items ?? [];
        if (!empty($items)) {
            foreach ($items as &$item) {
                if (isset($item['task_id'])) {
                    $task = \App\Models\Task::find($item['task_id']);
                    if ($task) {
                        if (!isset($item['task_name'])) {
                            $item['task_name'] = $task->name;
                        }
                        if (!isset($item['task_type'])) {
                            $item['task_type'] = $task->type;
                        }
                    }
                }
            }
            unset($item); // Break reference
            $invoice->items = $items;
        }

        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice->load(['user', 'payments']),
        ]);
        
        // Enable font subsetting for better Unicode support
        $pdf->setOption('enable-font-subsetting', true);
        $pdf->setOption('isRemoteEnabled', true);

        // Check if request is for print (via query parameter)
        if (request()->has('print')) {
            return $pdf->stream("invoice-{$invoice->invoice_number}.pdf");
        }

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }
}
