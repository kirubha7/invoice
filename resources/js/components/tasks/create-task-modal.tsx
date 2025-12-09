import TaskController from '@/actions/App/Http/Controllers/TaskController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Form, router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Project {
    id: number;
    name: string;
}

interface Props {
    projects: Project[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateTaskModal({
    projects,
    open,
    onOpenChange,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-3xl"
                onPointerDownOutside={(e) => {
                    // Prevent closing when clicking outside
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <Form
                    action={TaskController.store()}
                    className="space-y-4"
                    onSuccess={() => {
                        onOpenChange(false);
                        toast.success('Task created successfully');
                        router.reload({ only: ['tasks', 'projects'] });
                    }}
                    onError={() => {
                        toast.error('Failed to create task');
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <div>
                                <Label htmlFor="project_id">Project *</Label>
                                <select
                                    id="project_id"
                                    name="project_id"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
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
                                    required 
                                    onKeyDown={(e) => {
                                        // Prevent form submission on Enter key in input field
                                        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <RichTextEditor
                                    id="description"
                                    name="description"
                                    placeholder="Enter task description..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div>
                                <Label htmlFor="type">Type *</Label>
                                <select
                                    id="type"
                                    name="type"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="">Select a type</option>
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
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="">Select a status</option>
                                    <option value="pending">Pending</option>
                                    <option value="partially_complete">Partially Complete</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

