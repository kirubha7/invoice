import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { HtmlContent } from '@/components/html-content';

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
    project?: Project;
}

interface Props {
    task: Task;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: () => void;
}

export default function ViewTaskModal({
    task,
    open,
    onOpenChange,
    onEdit,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{task.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                            Project
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {task.project?.name || 'No project assigned'}
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
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    {onEdit && (
                        <Button type="button" onClick={onEdit}>
                            Edit
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

