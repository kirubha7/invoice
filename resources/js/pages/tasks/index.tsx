import CreateTaskModal from '@/components/tasks/create-task-modal';
import EditTaskModal from '@/components/tasks/edit-task-modal';
import ViewTaskModal from '@/components/tasks/view-task-modal';
import DeleteTaskModal from '@/components/tasks/delete-task-modal';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HtmlContent } from '@/components/html-content';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { CheckSquare, Plus, Trash2, Eye, Edit, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type PaginatedData } from '@/types';
import { useState } from 'react';

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    project_id: number;
    name: string;
    description: string | null;
    status: string;
    type: string;
    project: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    tasks: PaginatedData<Task>;
    projects: Project[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: TaskController.index().url,
    },
];

export default function Index({ tasks, projects }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [viewTask, setViewTask] = useState<Task | null>(null);

    const handleView = async (task: Task) => {
        try {
            const response = await fetch(TaskController.apiShow.url({ task: task.id }), {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (response.ok) {
                const taskData = await response.json();
                setViewTask(taskData);
                setViewModalOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch task:', error);
        }
    };

    const handleDelete = (task: Task) => {
        setSelectedTask(task);
        setDeleteModalOpen(true);
    };

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setEditModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Tasks</h1>
                    </div>
                    <Button onClick={() => setCreateModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Create Task
                    </Button>
                </div>

                <CreateTaskModal
                    projects={projects}
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                />
                {selectedTask && (
                    <>
                        <EditTaskModal
                            task={selectedTask}
                            projects={projects}
                            open={editModalOpen}
                            onOpenChange={(open) => {
                                setEditModalOpen(open);
                                if (!open) {
                                    setSelectedTask(null);
                                }
                            }}
                        />
                        <DeleteTaskModal
                            taskId={selectedTask.id}
                            taskName={selectedTask.name}
                            open={deleteModalOpen}
                            onOpenChange={(open) => {
                                setDeleteModalOpen(open);
                                if (!open) {
                                    setSelectedTask(null);
                                }
                            }}
                        />
                    </>
                )}
                {viewTask && (
                    <ViewTaskModal
                        task={viewTask}
                        open={viewModalOpen}
                        onOpenChange={setViewModalOpen}
                        onEdit={() => {
                            setViewModalOpen(false);
                            setSelectedTask(viewTask);
                            setEditModalOpen(true);
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
                                        Project
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {tasks.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-sm text-neutral-500"
                                        >
                                            No tasks found. Create your first
                                            task!
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.data.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                {task.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {task.project.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {task.description ? (
                                                    <HtmlContent
                                                        content={task.description}
                                                        className="prose prose-sm max-w-none"
                                                        fallback="-"
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {task.type === 'feature' ? 'Feature' : task.type === 'bug_fix' ? 'Bug Fix' : 'Change Request'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    task.status === 'completed' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : task.status === 'partially_complete'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                }`}>
                                                    {task.status === 'completed' ? 'Completed' : task.status === 'partially_complete' ? 'Partially Complete' : 'Pending'}
                                                </span>
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
                                                                handleView(task)
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleEdit(task)
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDelete(task)
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

                    {tasks.links && tasks.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {tasks.links[0].url && (
                                    <Link
                                        href={tasks.links[0].url}
                                        className="relative inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {tasks.links[
                                    tasks.links.length - 1
                                ].url && (
                                    <Link
                                        href={
                                            tasks.links[
                                                tasks.links.length - 1
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
                                            {tasks.from}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {tasks.to}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">
                                            {tasks.total}
                                        </span>{' '}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                        aria-label="Pagination"
                                    >
                                        {tasks.links.map((link, index) => (
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

