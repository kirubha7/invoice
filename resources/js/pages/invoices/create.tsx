import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import CreateCustomerModal from '@/components/customers/create-customer-modal';
import InputError from '@/components/input-error';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: InvoiceController.index().url,
    },
    {
        title: 'Create Invoice',
        href: InvoiceController.create().url,
    },
];

interface InvoiceItem {
    description: string;
    price: number;
    project_id?: number;
    task_id?: number;
    task_name?: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
}

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    name: string;
    description: string | null;
    price: number;
    project_id: number;
}

interface Props {
    customers: Customer[];
    projects?: Project[];
}

export default function Create({ customers, projects = [] }: Props) {
    const [items, setItems] = useState<InvoiceItem[]>([
        { description: '', price: 0 },
    ]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);

    const addItem = () => {
        // If a project is selected and has tasks, add all available tasks
        if (selectedProjectId && projectTasks.length > 0) {
            const existingTaskIds = items
                .map((item) => item.task_id)
                .filter((id): id is number => id !== null && id !== undefined);
            
            const newTasks = projectTasks.filter(
                (task) => !existingTaskIds.includes(task.id)
            );
            
            if (newTasks.length > 0) {
                const newItems = newTasks.map((task) => ({
                    description: task.description || '',
                    price: task.price || 0,
                    project_id: task.project_id,
                    task_id: task.id,
                    task_name: task.name,
                }));
                setItems([...items, ...newItems]);
            } else {
                // If all tasks are already added, just add an empty item
                setItems([...items, { description: '', price: 0 }]);
            }
        } else {
            // No project selected, add empty item
            setItems([...items, { description: '', price: 0 }]);
        }
    };

    const handleProjectChange = async (projectId: string) => {
        setSelectedProjectId(projectId);
        if (projectId) {
            try {
                const response = await fetch(`/api/projects/${projectId}/tasks`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                });
                if (response.ok) {
                    const tasks = await response.json();
                    setProjectTasks(tasks);
                } else {
                    setProjectTasks([]);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setProjectTasks([]);
            }
        } else {
            setProjectTasks([]);
        }
    };


    const handleTaskChange = (itemIndex: number, taskId: string) => {
        const selectedTask = projectTasks.find((t) => t.id === parseInt(taskId));
        
        if (selectedTask) {
            const updated = [...items];
            updated[itemIndex] = {
                ...updated[itemIndex],
                task_id: selectedTask.id,
                task_name: selectedTask.name,
                project_id: selectedTask.project_id,
                description: selectedTask.description || selectedTask.name,
                price: selectedTask.price || 0,
            };
            setItems(updated);
        } else {
            const updated = [...items];
            updated[itemIndex] = {
                ...updated[itemIndex],
                task_id: undefined,
                task_name: undefined,
                project_id: undefined,
            };
            setItems(updated);
        }
    };


    const addTaskAsItem = (task: Task) => {
        setItems([
            ...items,
            {
                description: task.description || task.name,
                price: task.price || 0,
                project_id: task.project_id,
                task_id: task.id,
                task_name: task.name,
            },
        ]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (
        index: number,
        field: keyof InvoiceItem,
        value: string | number | undefined,
    ) => {
        const updated = [...items];
        if (value === undefined) {
            const { [field]: _, ...rest } = updated[index];
            updated[index] = rest as InvoiceItem;
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setItems(updated);
    };

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => {
            return sum + item.price;
        }, 0);
        return { subtotal };
    };

    const [discount, setDiscount] = useState<number>(0);
    const { subtotal } = calculateTotals();
    
    const calculateFinalTotal = () => {
        const discountAmount = subtotal * (discount / 100);
        return subtotal - discountAmount;
    };
    
    const finalTotal = calculateFinalTotal();
    const [createCustomerModalOpen, setCreateCustomerModalOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [customerData, setCustomerData] = useState({
        customer_id: '',
        customer_name: '',
        customer_email: '',
        customer_address: '',
    });
    const [invoiceDate, setInvoiceDate] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');

    // Remove formData state - we'll use Form component's data prop directly

    // Sync rich text editor values to items state
    useEffect(() => {
        const syncDescriptions = () => {
            const updatedItems = items.map((item, index) => {
                const editorInput = document.querySelector(
                    `input[name="item_description_${index}"]`
                ) as HTMLInputElement;
                if (editorInput && editorInput.value !== item.description) {
                    return {
                        ...item,
                        description: editorInput.value,
                    };
                }
                return item;
            });
            
            // Only update if there are changes
            const hasChanges = updatedItems.some(
                (item, index) => item.description !== items[index].description
            );
            
            if (hasChanges) {
                setItems(updatedItems);
            }
        };

        // Sync on a delay to avoid too many updates
        const timeoutId = setTimeout(syncDescriptions, 500);
        return () => clearTimeout(timeoutId);
    }, [items]);


    const handleCustomerChange = (customerId: string) => {
        setSelectedCustomerId(customerId);
        if (customerId) {
            const customer = customers.find((c) => c.id === parseInt(customerId));
            if (customer) {
                setCustomerData({
                    customer_id: customer.id.toString(),
                    customer_name: customer.name,
                    customer_email: customer.email,
                    customer_address: customer.address || '',
                });
            }
        } else {
            setCustomerData({
                customer_id: '',
                customer_name: '',
                customer_email: '',
                customer_address: '',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invoice" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={InvoiceController.index().url}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">
                            Create Invoice
                        </h1>
                    </div>
                </div>

                <Form
                    action={InvoiceController.store()}
                    className="space-y-6"
                    transform={(data) => {
                        // Sync rich text editor values before transform
                        const updatedItems = items.map((item, index) => {
                            const editorInput = document.querySelector(
                                `input[name="item_description_${index}"]`
                            ) as HTMLInputElement;
                            if (editorInput && editorInput.value) {
                                return {
                                    ...item,
                                    description: editorInput.value,
                                };
                            }
                            return item;
                        });
                        
                        return {
                            ...data,
                            items: updatedItems,
                            subtotal: subtotal.toFixed(2),
                            tax: '0.00',
                            total: finalTotal.toFixed(2),
                            discount: discount.toString(),
                        };
                    }}
                    onSuccess={() => {
                        toast.success('Invoice created successfully');
                    }}
                    onError={() => {
                        toast.error('Failed to create invoice');
                    }}
                    defaults={{
                        customer_id: '',
                        customer_name: '',
                        customer_email: '',
                        customer_address: '',
                        invoice_date: '',
                        due_date: '',
                        status: 'draft',
                        notes: '',
                        items: items,
                        subtotal: subtotal.toFixed(2),
                        tax: '0.00',
                        total: finalTotal.toFixed(2),
                        discount: discount.toString(),
                    }}
                >
                    {({ processing, errors, data = {}, setData }) => (
                            <>
                                <CreateCustomerModal
                                open={createCustomerModalOpen}
                                onOpenChange={(open) => {
                                    setCreateCustomerModalOpen(open);
                                    if (!open) {
                                        // Reload page to get updated customers list
                                        router.reload();
                                    }
                                }}
                            />
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">
                                            Customer Information
                                        </h2>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCreateCustomerModalOpen(true)
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            New Customer
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="customer_id">
                                                Select Customer *
                                            </Label>
                                            <select
                                                id="customer_id"
                                                name="customer_id"
                                                value={selectedCustomerId}
                                                onChange={(e) =>
                                                    handleCustomerChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                required
                                            >
                                                <option value="">
                                                    Select a customer
                                                </option>
                                                {customers.map((customer) => (
                                                    <option
                                                        key={customer.id}
                                                        value={customer.id}
                                                    >
                                                        {customer.name} -{' '}
                                                        {customer.email}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.customer_id}
                                            />
                                            <input
                                                type="hidden"
                                                name="customer_id"
                                                value={customerData.customer_id}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_name">
                                                Customer Name *
                                            </Label>
                                            <Input
                                                id="customer_name"
                                                name="customer_name"
                                                defaultValue={customerData.customer_name}
                                                required
                                            />
                                            <InputError
                                                message={errors.customer_name}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_email">
                                                Customer Email *
                                            </Label>
                                            <Input
                                                id="customer_email"
                                                type="email"
                                                name="customer_email"
                                                defaultValue={customerData.customer_email}
                                                required
                                            />
                                            <InputError
                                                message={errors.customer_email}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_address">
                                                Customer Address
                                            </Label>
                                            <Input
                                                id="customer_address"
                                                name="customer_address"
                                                defaultValue={customerData.customer_address}
                                            />
                                            <InputError
                                                message={errors.customer_address}
                                            />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <h2 className="mb-4 text-lg font-semibold">
                                        Invoice Details
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="invoice_date">
                                                Invoice Date *
                                            </Label>
                                            <Input
                                                id="invoice_date"
                                                type="date"
                                                name="invoice_date"
                                                value={invoiceDate}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setInvoiceDate(value);
                                                    setData('invoice_date', value);
                                                }}
                                                required
                                            />
                                            <InputError
                                                message={errors.invoice_date}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="due_date">
                                                Due Date *
                                            </Label>
                                            <Input
                                                id="due_date"
                                                type="date"
                                                name="due_date"
                                                value={dueDate}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDueDate(value);
                                                    setData('due_date', value);
                                                }}
                                                required
                                            />
                                            <InputError
                                                message={errors.due_date}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="status">
                                                Status *
                                            </Label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={data.status || 'draft'}
                                                onChange={(e) =>
                                                    setData(
                                                        'status',
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                required
                                            >
                                                <option value="draft">
                                                    Draft
                                                </option>
                                                <option value="sent">Sent</option>
                                                <option value="paid">Paid</option>
                                                <option value="overdue">
                                                    Overdue
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.status}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <Card className="p-6">
                                <div className="mb-4 flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label htmlFor="project_select">
                                            Select Project
                                        </Label>
                                        <select
                                            id="project_select"
                                            value={selectedProjectId}
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">
                                                Select a project
                                            </option>
                                            {projects.map((project) => (
                                                <option
                                                    key={project.id}
                                                    value={project.id}
                                                >
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addItem}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>


                                <div className="space-y-4">
                                    {items.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="flex gap-4 rounded-lg border p-4 items-end"
                                            >
                                                <div className="w-48">
                                                    <Label
                                                        htmlFor={`item_task_${index}`}
                                                    >
                                                        Task
                                                    </Label>
                                                    <select
                                                        id={`item_task_${index}`}
                                                        value={item.task_id || ''}
                                                        onChange={(e) =>
                                                            handleTaskChange(
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={!selectedProjectId}
                                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <option value="">
                                                            Select task
                                                        </option>
                                                        {projectTasks
                                                            .filter((task) => {
                                                                // Filter out tasks already used in other items
                                                                const usedTaskIds = items
                                                                    .map((itm, idx) => 
                                                                        idx !== index && itm.task_id 
                                                                            ? itm.task_id 
                                                                            : null
                                                                    )
                                                                    .filter((id): id is number => id !== null && id !== undefined);
                                                                return !usedTaskIds.includes(task.id) || item.task_id === task.id;
                                                            })
                                                            .map((task) => (
                                                                <option
                                                                    key={task.id}
                                                                    value={task.id}
                                                                >
                                                                    {task.name} - ₹
                                                                    {(task.price || 0).toFixed(2)}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`item_description_${index}`}
                                                    >
                                                        Description
                                                        {item.task_name && (
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                (Task: {item.task_name})
                                                            </span>
                                                        )}
                                                    </Label>
                                                    <RichTextEditor
                                                        id={`item_description_${index}`}
                                                        name={`item_description_${index}`}
                                                        defaultValue={item.description}
                                                        placeholder="Item description"
                                                        className="min-h-[100px]"
                                                    />
                                                </div>
                                                <div className="w-32">
                                                    <Label
                                                        htmlFor={`item_price_${index}`}
                                                    >
                                                        Price
                                                    </Label>
                                                    <Input
                                                        id={`item_price_${index}`}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.price}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'price',
                                                                parseFloat(
                                                                    e.target.value,
                                                                ) || 0,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeItem(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                            </Card>

                            <Card className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={data.notes || ''}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                            rows={4}
                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>

                                    <div className="ml-auto w-full space-y-2 md:w-64">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <Label htmlFor="discount">
                                                Discount (%)
                                            </Label>
                                            <Input
                                                id="discount"
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={discount}
                                                onChange={(e) =>
                                                    setDiscount(
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                                            <span>Total:</span>
                                            <span>₹{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>


                            <div className="flex justify-end gap-4">
                                <Link href={InvoiceController.index().url}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Invoice'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}

