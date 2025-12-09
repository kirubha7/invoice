import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HtmlContent } from '@/components/html-content';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    name: string;
    description: string | null;
    status: string;
    type: string;
    created_at: string;
    project: Project;
}

interface Props {
    task: Task;
}

export default function Show({ task }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: TaskController.index().url,
        },
        {
            title: task.name,
            href: TaskController.show({ task: task.id }).url,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(TaskController.destroy({ task: task.id }).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={task.name} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={TaskController.index().url}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">{task.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={TaskController.edit({ task: task.id }).url}
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
                                Project
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {task.project.name}
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Description
                            </h3>
                            <HtmlContent
                                content={task.description}
                                className="text-sm text-neutral-600 dark:text-neutral-400 prose prose-sm max-w-none"
                            />
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Type
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {task.type === 'feature' ? 'Feature' : task.type === 'bug_fix' ? 'Bug Fix' : 'Change Request'}
                                </span>
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Status
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                    task.status === 'completed' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : task.status === 'partially_complete'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                    {task.status === 'completed' ? 'Completed' : task.status === 'partially_complete' ? 'Partially Complete' : 'Pending'}
                                </span>
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Created
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {new Date(task.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

