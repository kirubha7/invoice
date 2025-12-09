import TaskController from '@/actions/App/Http/Controllers/TaskController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/rich-text-editor';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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
}

interface Props {
    task: Task;
    projects: Project[];
}

export default function Edit({ task, projects }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: TaskController.index().url,
        },
        {
            title: 'Edit Task',
            href: TaskController.edit({ task: task.id }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link
                            href={TaskController.show({ task: task.id }).url}
                        >
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">Edit Task</h1>
                    </div>
                </div>

                <Card className="p-6">
                    <Form
                        {...TaskController.update({ task: task.id }).form()}
                        className="space-y-6"
                    >
                        {({ processing, errors, data, setData }) => (
                            <>
                                <div>
                                    <Label htmlFor="project_id">Project *</Label>
                                    <select
                                        id="project_id"
                                        name="project_id"
                                        defaultValue={task.project_id}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        {projects.map((project) => (
                                            <option
                                                key={project.id}
                                                value={project.id}
                                            >
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.project_id} />
                                </div>

                                <div>
                                    <Label htmlFor="name">Task Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={task.name}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <RichTextEditor
                                        id="description"
                                        name="description"
                                        defaultValue={task.description || ''}
                                        placeholder="Enter task description..."
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div>
                                    <Label htmlFor="type">Type *</Label>
                                    <select
                                        id="type"
                                        name="type"
                                        defaultValue={task.type}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="feature">Feature</option>
                                        <option value="bug_fix">Bug Fix</option>
                                        <option value="change_request">Change Request</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>

                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        defaultValue={task.status}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="partially_complete">Partially Complete</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href={TaskController.show({ task: task.id }).url}
                                    >
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Task'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}

