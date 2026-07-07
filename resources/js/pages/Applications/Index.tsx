import { Head, router } from '@inertiajs/react';

import { EmptyState } from '@/components/EmptyState';
import { AppWindow, Eye, Trash2 } from '@/components/Icons';
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
import type { Application } from '@/types/resource';

interface ApplicationsIndexProps {
    applications: PaginatedData<Application>;
}

export default function ApplicationsIndex({
    applications,
}: ApplicationsIndexProps) {
    return (
        <AppLayout>
            <Head title="Applications" />
            <PageHeader
                title="Applications"
                description="Managed application resources"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Applications' },
                ]}
                actions={
                    <Button href="/applications/create">Create Application</Button>
                }
            />
            {applications.data.length === 0 ? (
                <EmptyState
                    title="No applications"
                    description="Create an application resource to get started."
                    icon={<AppWindow size={40} />}
                    action={
                        <Button href="/applications/create">
                            Create Application
                        </Button>
                    }
                />
            ) : (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.data.map((app) => (
                                <TableRow key={app.uuid}>
                                    <TableCell className="font-medium">
                                        {app.name}
                                    </TableCell>
                                    <TableCell>{app.type_label}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                app.status === 'active'
                                                    ? 'success'
                                                    : 'secondary'
                                            }
                                        >
                                            {app.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            href={`/applications/${app.uuid}`}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                router.delete(
                                                    `/applications/${app.uuid}`,
                                                )
                                            }
                                        >
                                            <Trash2
                                                size={16}
                                                className="text-destructive"
                                            />
                                        </Button>
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
