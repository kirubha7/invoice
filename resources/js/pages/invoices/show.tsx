import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, Edit, Printer, Trash2, Plus, X } from 'lucide-react';
import PaymentModal from '@/components/invoices/payment-modal';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Payment {
    id: number;
    amount: string;
    payment_date: string;
    payment_method: string | null;
    notes: string | null;
    created_at: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    customer_name: string;
    customer_email: string;
    customer_address: string | null;
    invoice_date: string;
    due_date: string;
    subtotal: string;
    tax: string;
    total: string;
    status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue';
    notes: string | null;
    items: Array<{
        description: string;
        price: number;
        task_name?: string;
        task_type?: string;
    }> | null;
    payments?: Payment[];
    total_paid?: number;
    remaining_amount?: number;
}

interface Props {
    invoice: Invoice;
}

export default function Show({ invoice }: Props) {
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [deletePaymentModalOpen, setDeletePaymentModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Invoices',
            href: InvoiceController.index().url,
        },
        {
            title: invoice.invoice_number,
            href: InvoiceController.show({ invoice: invoice.id }).url,
        },
    ];

    const totalPaid = invoice.total_paid ?? invoice.payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) ?? 0;
    const invoiceTotal = parseFloat(invoice.total);
    const remainingAmount = invoice.remaining_amount ?? Math.max(0, invoiceTotal - totalPaid);
    const payments = invoice.payments || [];

    const handleDeletePaymentClick = (paymentId: number) => {
        setPaymentToDelete(paymentId);
        setDeletePaymentModalOpen(true);
    };

    const handleConfirmDeletePayment = () => {
        if (paymentToDelete) {
            router.delete(`/invoices/${invoice.id}/payments/${paymentToDelete}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setDeletePaymentModalOpen(false);
                    setPaymentToDelete(null);
                },
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(InvoiceController.destroy({ invoice: invoice.id }).url);
        }
    };

    const handlePrint = () => {
        // Open PDF in new window for printing
        const pdfUrl = InvoiceController.pdf({ invoice: invoice.id }).url + '?print=1';
        const printWindow = window.open(pdfUrl, '_blank');
        
        // Wait for PDF to load, then trigger print dialog
        if (printWindow) {
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            };
        }
    };

    const handleExportPDF = () => {
        window.location.href = InvoiceController.pdf({ invoice: invoice.id }).url;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'partially_paid':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'sent':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const items = invoice.items || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-2">
                        <Link href={InvoiceController.index().url}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">
                            Invoice {invoice.invoice_number}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            onClick={() => setPaymentModalOpen(true)}
                            disabled={remainingAmount <= 0}
                        >
                            <Plus className="h-4 w-4" />
                            Record Payment
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExportPDF}
                        >
                            <Download className="h-4 w-4" />
                            Export PDF
                        </Button>
                        <Link
                            href={InvoiceController.edit({ invoice: invoice.id }).url}
                        >
                            <Button variant="outline">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Card className="p-8 print:shadow-none">
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">INVOICE</h2>
                            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                Invoice Number: {invoice.invoice_number}
                            </p>
                        </div>
                        <div className="text-right">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(invoice.status)}`}
                            >
                                {invoice.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="mb-8 grid gap-8 md:grid-cols-2">
                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Bill To:
                            </h3>
                            <p className="font-medium">{invoice.customer_name}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {invoice.customer_email}
                            </p>
                            {invoice.customer_address && (
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                    {invoice.customer_address}
                                </p>
                            )}
                        </div>
                        <div className="text-right md:text-left">
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Invoice Details:
                            </h3>
                            <p className="text-sm">
                                <span className="font-medium">Invoice Date:</span>{' '}
                                {new Date(invoice.invoice_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Due Date:</span>{' '}
                                {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8 overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 dark:bg-neutral-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Task Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {items.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-4 text-center text-sm text-neutral-500"
                                        >
                                            No items
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, index) => {
                                        const getTaskTypeLabel = (type?: string) => {
                                            if (!type) return '';
                                            const typeMap: Record<string, string> = {
                                                'feature': 'Feature',
                                                'bug_fix': 'Bug Fix',
                                                'change_request': 'Change Request',
                                            };
                                            return typeMap[type] || type;
                                        };
                                        
                                        return (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-sm">
                                                <div>
                                                    {item.task_name || '-'}
                                                    {item.task_type && (
                                                        <span className="ml-2 text-xs text-muted-foreground">
                                                            ({getTaskTypeLabel(item.task_type)})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm">
                                                ₹{parseFloat(item.price.toString()).toFixed(2)}
                                            </td>
                                        </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-full space-y-2 md:w-64">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600 dark:text-neutral-400">Subtotal:</span>
                                <span className="text-neutral-900 dark:text-neutral-100">
                                    ₹{parseFloat(invoice.subtotal).toFixed(2)}
                                </span>
                            </div>
                            {totalPaid > 0 && (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600 dark:text-neutral-400">Total Paid:</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            ₹{totalPaid.toFixed(2)}
                                        </span>
                                    </div>
                                    {remainingAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600 dark:text-neutral-400">Remaining:</span>
                                            <span className="text-orange-600 dark:text-orange-400 font-medium">
                                                ₹{remainingAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex justify-between border-t border-neutral-200 pt-2 text-lg font-bold dark:border-neutral-800">
                                <span>Total:</span>
                                <span>
                                    ₹{parseFloat(invoice.total).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Payments
                            </h3>
                            {remainingAmount > 0 && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => setPaymentModalOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                    Record Payment
                                </Button>
                            )}
                        </div>
                        
                        {payments.length > 0 ? (
                            <div className="space-y-2">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="font-medium">₹{parseFloat(payment.amount).toFixed(2)}</p>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {new Date(payment.payment_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {payment.payment_method && (
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </div>
                                                )}
                                                {payment.notes && (
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {payment.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeletePaymentClick(payment.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-neutral-200 p-8 text-center dark:border-neutral-800">
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                                    No payments recorded yet
                                </p>
                                {remainingAmount > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setPaymentModalOpen(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Record First Payment
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {invoice.notes && (
                        <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Notes:
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                                {invoice.notes}
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            <PaymentModal
                open={paymentModalOpen}
                onOpenChange={setPaymentModalOpen}
                invoiceId={invoice.id}
                invoiceTotal={invoiceTotal}
                totalPaid={totalPaid}
                remainingAmount={remainingAmount}
            />

            <Dialog open={deletePaymentModalOpen} onOpenChange={setDeletePaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Payment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this payment? This action cannot be undone and will update the invoice status accordingly.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeletePaymentModalOpen(false);
                                setPaymentToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDeletePayment}
                        >
                            Delete Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <style>{`
                @media print {
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </AppLayout>
    );
}

