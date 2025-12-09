import CreateCustomerModal from '@/components/customers/create-customer-modal';
import EditCustomerModal from '@/components/customers/edit-customer-modal';
import ViewCustomerModal from '@/components/customers/view-customer-modal';
import DeleteCustomerModal from '@/components/customers/delete-customer-modal';
import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Users, Plus, Trash2, Eye, Edit, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type PaginatedData } from '@/types';
import { useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    address: string | null;
    phone: string | null;
    created_at: string;
}

interface Props {
    customers: PaginatedData<Customer>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: CustomerController.index().url,
    },
];

export default function Index({ customers }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

    const handleView = async (customer: Customer) => {
        try {
            const response = await fetch(CustomerController.apiShow.url({ customer: customer.id }), {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (response.ok) {
                const customerData = await response.json();
                setViewCustomer(customerData);
                setViewModalOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch customer:', error);
        }
    };

    const handleDelete = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Customers</h1>
                    </div>
                    <Button onClick={() => setCreateModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Create Customer
                    </Button>
                </div>

                <CreateCustomerModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                />
                {selectedCustomer && (
                    <>
                        <EditCustomerModal
                            customer={selectedCustomer}
                            open={editModalOpen}
                            onOpenChange={(open) => {
                                setEditModalOpen(open);
                                if (!open) {
                                    setSelectedCustomer(null);
                                }
                            }}
                        />
                        <DeleteCustomerModal
                            customerId={selectedCustomer.id}
                            customerName={selectedCustomer.name}
                            open={deleteModalOpen}
                            onOpenChange={(open) => {
                                setDeleteModalOpen(open);
                                if (!open) {
                                    setSelectedCustomer(null);
                                }
                            }}
                        />
                    </>
                )}
                {viewCustomer && (
                    <ViewCustomerModal
                        customer={viewCustomer}
                        open={viewModalOpen}
                        onOpenChange={(open) => {
                            setViewModalOpen(open);
                            if (!open) {
                                setViewCustomer(null);
                            }
                        }}
                        onEdit={() => {
                            setViewModalOpen(false);
                            setSelectedCustomer(viewCustomer);
                            setEditModalOpen(true);
                            setViewCustomer(null);
                        }}
                    />
                )}

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 dark:bg-neutral-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {customers.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-4 text-center text-sm text-neutral-500"
                                        >
                                            No customers found. Create your first
                                            customer!
                                        </td>
                                    </tr>
                                ) : (
                                    customers.data.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                {customer.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {customer.email}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {customer.phone || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {customer.address || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleView(customer)
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleEdit(customer)
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDelete(customer)
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {customers.links && customers.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {customers.links[0].url && (
                                    <Link
                                        href={customers.links[0].url}
                                        className="relative inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {customers.links[
                                    customers.links.length - 1
                                ].url && (
                                    <Link
                                        href={
                                            customers.links[
                                                customers.links.length - 1
                                            ].url
                                        }
                                        className="relative ml-3 inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {customers.from}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {customers.to}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">
                                            {customers.total}
                                        </span>{' '}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                        aria-label="Pagination"
                                    >
                                        {customers.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'z-10 bg-primary text-primary-foreground focus:z-20'
                                                        : 'bg-white text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-20 focus:outline-offset-0 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700 dark:hover:bg-neutral-700'
                                                } ${
                                                    !link.url
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

