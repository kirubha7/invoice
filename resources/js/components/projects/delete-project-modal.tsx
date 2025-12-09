import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Props {
    projectId: number;
    projectName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteProjectModal({
    projectId,
    projectName,
    open,
    onOpenChange,
}: Props) {
    const handleDelete = () => {
        router.delete(ProjectController.destroy({ project: projectId }).url, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Project deleted successfully');
                router.reload({ only: ['projects'] });
            },
            onError: () => {
                toast.error('Failed to delete project');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">{projectName}</span>? This
                        action cannot be undone.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

