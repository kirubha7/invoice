import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
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
    description: string | null;
}

interface Props {
    project: Project;
}

export default function Edit({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: ProjectController.index().url,
        },
        {
            title: 'Edit Project',
            href: ProjectController.edit({ project: project.id }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link
                            href={ProjectController.show({ project: project.id }).url}
                        >
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">Edit Project</h1>
                    </div>
                </div>

                <Card className="p-6">
                    <Form
                        {...ProjectController.update({ project: project.id }).form()}
                        className="space-y-6"
                    >
                        {({ processing, errors, data, setData }) => (
                            <>
                                <div>
                                    <Label htmlFor="name">
                                        Project Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={project.name}
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
                                        defaultValue={project.description || ''}
                                        placeholder="Enter project description..."
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href={ProjectController.show({ project: project.id }).url}
                                    >
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Updating...'
                                            : 'Update Project'}
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

