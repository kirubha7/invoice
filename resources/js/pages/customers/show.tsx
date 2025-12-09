import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: string;
}

interface Props {
    customer: Customer;
}

export default function Show({ customer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: CustomerController.index().url,
        },
        {
            title: customer.name,
            href: CustomerController.show({ customer: customer.id }).url,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(CustomerController.destroy({ customer: customer.id }).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={customer.name} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={CustomerController.index().url}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">{customer.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={CustomerController.edit({ customer: customer.id }).url}
                        >
                            <Button variant="outline">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Card className="p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Email
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {customer.email}
                            </p>
                        </div>

                        {customer.phone && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                    Phone
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {customer.phone}
                                </p>
                            </div>
                        )}

                        {customer.address && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                    Address
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {customer.address}
                                </p>
                            </div>
                        )}

                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Created
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {new Date(customer.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

