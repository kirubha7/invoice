import TaskController from '@/actions/App/Http/Controllers/TaskController';
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
    taskId: number;
    taskName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteTaskModal({
    taskId,
    taskName,
    open,
    onOpenChange,
}: Props) {
    const handleDelete = () => {
        router.delete(TaskController.destroy({ task: taskId }).url, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Task deleted successfully');
                router.reload({ only: ['tasks'] });
            },
            onError: () => {
                toast.error('Failed to delete task');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">{taskName}</span>? This
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

