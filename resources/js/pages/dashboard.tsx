import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    FolderKanban,
    CheckSquare,
    Users,
    FileText,
    DollarSign,
    Clock,
    CheckCircle2,
} from 'lucide-react';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Invoice {
    id: number;
    invoice_number: string;
    customer_name: string | null;
    total: string;
    status: string;
    invoice_date: string;
    customer?: {
        name: string;
    } | null;
}

interface Project {
    id: number;
    name: string;
    created_at: string;
}

interface Stats {
    projects: number;
    tasks: number;
    customers: number;
    invoices: number;
    total_revenue: string;
    pending_invoices: number;
    paid_invoices: number;
}

interface Props {
    stats: Stats;
    recentInvoices: Invoice[];
    recentProjects: Project[];
}

export default function Dashboard({ stats, recentInvoices, recentProjects }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'sent':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Projects
                                </p>
                                <p className="text-2xl font-bold">{stats.projects}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                <FolderKanban className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Tasks
                                </p>
                                <p className="text-2xl font-bold">{stats.tasks}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                                <CheckSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Customers
                                </p>
                                <p className="text-2xl font-bold">{stats.customers}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold">
                                    ${parseFloat(stats.total_revenue || '0').toFixed(2)}
                                </p>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Invoice Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Total Invoices
                                </p>
                                <p className="text-2xl font-bold">{stats.invoices}</p>
                            </div>
                            <FileText className="h-8 w-8 text-neutral-400" />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Paid Invoices
                                </p>
                                <p className="text-2xl font-bold">{stats.paid_invoices}</p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Pending Invoices
                                </p>
                                <p className="text-2xl font-bold">{stats.pending_invoices}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </Card>
                </div>

                {/* Recent Items */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Projects */}
                    <Card className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Recent Projects</h2>
                            <Link
                                href={ProjectController.index().url}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </Link>
                        </div>
                        {recentProjects.length === 0 ? (
                            <p className="text-sm text-neutral-500">
                                No projects yet. Create your first project!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={ProjectController.show({ project: project.id }).url}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                    >
                                        <p className="font-medium">{project.name}</p>
                                        <p className="text-xs text-neutral-500">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Recent Invoices */}
                    <Card className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Recent Invoices</h2>
                            <Link
                                href={InvoiceController.index().url}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </Link>
                        </div>
                        {recentInvoices.length === 0 ? (
                            <p className="text-sm text-neutral-500">
                                No invoices yet. Create your first invoice!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentInvoices.map((invoice) => (
                                    <Link
                                        key={invoice.id}
                                        href={InvoiceController.show({ invoice: invoice.id }).url}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    {invoice.invoice_number}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {invoice.customer?.name ||
                                                        invoice.customer_name ||
                                                        'No customer'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ${parseFloat(invoice.total).toFixed(2)}
                                                </p>
                                                <span
                                                    className={`inline-block rounded-full px-2 py-1 text-xs ${getStatusColor(invoice.status)}`}
                                                >
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
