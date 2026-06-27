import { Head, router } from '@inertiajs/react';

import { EmptyState } from '@/components/EmptyState';
import { Eye, FolderKanban, Pencil, Plus, Trash2 } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';
import type { PaginatedData } from '@/types/pagination';
import type { Project } from '@/types/resource';

interface ProjectsIndexProps {
    projects: PaginatedData<Project>;
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
    const handleDelete = (project: Project) => {
        if (!window.confirm(`Delete project "${project.name}"?`)) {
return;
}

        router.delete(`/projects/${project.uuid}`);
    };

    return (
        <AppLayout>
            <Head title="Projects" />
            <PageHeader
                title="Projects"
                description="Organize infrastructure resources into projects"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Projects' },
                ]}
                actions={
                    <Button href="/projects/create">
                        <Plus size={16} />
                        New Project
                    </Button>
                }
            />
            {projects.data.length === 0 ? (
                <EmptyState
                    title="No projects yet"
                    description="Create a project to organize your resources."
                    icon={<FolderKanban size={40} />}
                    action={
                        <Button href="/projects/create">
                            <Plus size={16} />
                            New Project
                        </Button>
                    }
                />
            ) : (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Resources</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.data.map((project) => (
                                <TableRow key={project.uuid}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {project.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {project.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {project.applications_count ?? 0} apps ·{' '}
                                        {project.databases_count ?? 0} db ·{' '}
                                        {project.domains_count ?? 0} domains
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">
                                            {project.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                href={`/projects/${project.uuid}`}
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                href={`/projects/${project.uuid}/edit`}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(project)
                                                }
                                            >
                                                <Trash2
                                                    size={16}
                                                    className="text-destructive"
                                                />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AppLayout>
    );
}
