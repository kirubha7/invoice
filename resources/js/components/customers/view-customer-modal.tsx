import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: string;
}

interface Props {
    customer: Customer;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: () => void;
}

export default function ViewCustomerModal({
    customer,
    open,
    onOpenChange,
    onEdit,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{customer.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                            Email
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {customer.email}
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                            Phone
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {customer.phone || 'No phone number provided.'}
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                            Address
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {customer.address || 'No address provided.'}
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                            Created
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {new Date(customer.created_at).toLocaleDateString()}
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

