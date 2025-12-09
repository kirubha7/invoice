import CreateProjectModal from '@/components/projects/create-project-modal';
import EditProjectModal from '@/components/projects/edit-project-modal';
import ViewProjectModal from '@/components/projects/view-project-modal';
import DeleteProjectModal from '@/components/projects/delete-project-modal';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HtmlContent } from '@/components/html-content';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FolderKanban, Plus, Trash2, Eye, Edit, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type PaginatedData } from '@/types';
import { useState } from 'react';

interface Task {
    id: number;
    name: string;
    description: string | null;
    status: string;
    type: string;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    tasks?: Task[];
}

interface Props {
    projects: PaginatedData<Project>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: ProjectController.index().url,
    },
];

export default function Index({ projects }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [viewProject, setViewProject] = useState<Project | null>(null);

    const handleView = async (project: Project) => {
        try {
            const response = await fetch(ProjectController.apiShow.url({ project: project.id }), {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (response.ok) {
                const projectData = await response.json();
                setViewProject(projectData);
                setViewModalOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch project:', error);
        }
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setEditModalOpen(true);
    };

    const handleDelete = (project: Project) => {
        setSelectedProject(project);
        setDeleteModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FolderKanban className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Projects</h1>
                    </div>
                    <Button onClick={() => setCreateModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Create Project
                    </Button>
                </div>

                <CreateProjectModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                />
                {selectedProject && (
                    <>
                        <EditProjectModal
                            project={selectedProject}
                            open={editModalOpen}
                            onOpenChange={(open) => {
                                setEditModalOpen(open);
                                if (!open) {
                                    setSelectedProject(null);
                                }
                            }}
                        />
                        <DeleteProjectModal
                            projectId={selectedProject.id}
                            projectName={selectedProject.name}
                            open={deleteModalOpen}
                            onOpenChange={(open) => {
                                setDeleteModalOpen(open);
                                if (!open) {
                                    setSelectedProject(null);
                                }
                            }}
                        />
                    </>
                )}
                {viewProject && (
                    <ViewProjectModal
                        project={viewProject}
                        open={viewModalOpen}
                        onOpenChange={setViewModalOpen}
                        onEdit={() => {
                            setViewModalOpen(false);
                            setSelectedProject(viewProject);
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
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {projects.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-4 text-center text-sm text-neutral-500"
                                        >
                                            No projects found. Create your first
                                            project!
                                        </td>
                                    </tr>
                                ) : (
                                    projects.data.map((project) => (
                                        <tr
                                            key={project.id}
                                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                {project.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {project.description ? (
                                                    <HtmlContent
                                                        content={project.description}
                                                        className="prose prose-sm max-w-none"
                                                        fallback="-"
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {new Date(
                                                    project.created_at,
                                                ).toLocaleDateString()}
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
                                                                handleView(project)
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleEdit(project)
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDelete(project)
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

                    {projects.links && projects.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {projects.links[0].url && (
                                    <Link
                                        href={projects.links[0].url}
                                        className="relative inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {projects.links[
                                    projects.links.length - 1
                                ].url && (
                                    <Link
                                        href={
                                            projects.links[
                                                projects.links.length - 1
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
                                            {projects.from}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {projects.to}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">
                                            {projects.total}
                                        </span>{' '}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                        aria-label="Pagination"
                                    >
                                        {projects.links.map((link, index) => (
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

