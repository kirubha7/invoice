import EditProjectModal from '@/components/projects/edit-project-modal';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HtmlContent } from '@/components/html-content';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Task {
    id: number;
    name: string;
    description: string | null;
    status: string;
    type: string;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    tasks: Task[];
}

interface Props {
    project: Project;
}

export default function Show({ project }: Props) {
    const [editModalOpen, setEditModalOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: ProjectController.index().url,
        },
        {
            title: project.name,
            href: ProjectController.show({ project: project.id }).url,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(ProjectController.destroy({ project: project.id }).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={ProjectController.index().url}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">{project.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditModalOpen(true)}
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <EditProjectModal
                    project={project}
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                />

                <Card className="p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Description
                            </h3>
                            <HtmlContent
                                content={project.description}
                                className="text-sm text-neutral-600 dark:text-neutral-400 prose prose-sm max-w-none"
                            />
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                Created
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {new Date(project.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        {project.tasks && project.tasks.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                    Tasks ({project.tasks.length})
                                </h3>
                                <div className="space-y-2">
                                    {project.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="rounded-lg border p-3"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium">{task.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {task.type === 'feature' ? 'Feature' : task.type === 'bug_fix' ? 'Bug Fix' : 'Change Request'}
                                                    </span>
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                        task.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : task.status === 'partially_complete'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                    }`}>
                                                        {task.status === 'completed' ? 'Completed' : task.status === 'partially_complete' ? 'Partially Complete' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                            {task.description && (
                                                <HtmlContent
                                                    content={task.description}
                                                    className="text-sm text-neutral-500 prose prose-sm max-w-none"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

