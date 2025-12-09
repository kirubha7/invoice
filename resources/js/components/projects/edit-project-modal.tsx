import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
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
    description: string | null;
}

interface Props {
    project: Project;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProjectModal({
    project,
    open,
    onOpenChange,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <Form
                    action={ProjectController.update({ project: project.id })}
                    className="space-y-4"
                    onSuccess={() => {
                        onOpenChange(false);
                        toast.success('Project updated successfully');
                        router.reload({ only: ['projects'] });
                    }}
                    onError={() => {
                        toast.error('Failed to update project');
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <div>
                                <Label htmlFor="name">Project Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={project.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <RichTextEditor
                                    id="description"
                                    name="description"
                                    defaultValue={project.description || ''}
                                    placeholder="Enter project description..."
                                />
                                <InputError message={errors.description} />
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
                                    {processing ? 'Updating...' : 'Update'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

