import { Head, router } from '@inertiajs/react';

import { EmptyState } from '@/components/EmptyState';
import { Database, Eye } from '@/components/Icons';
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
import type { ManagedDatabase } from '@/types/resource';

interface DatabasesIndexProps {
    databases: PaginatedData<ManagedDatabase>;
}

export default function DatabasesIndex({ databases }: DatabasesIndexProps) {
    return (
        <AppLayout>
            <Head title="Databases" />
            <PageHeader
                title="PostgreSQL Databases"
                description="Independent database resources"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Databases' },
                ]}
                actions={
                    <Button href="/resources/create">Create Resource</Button>
                }
            />
            {databases.data.length === 0 ? (
                <EmptyState
                    title="No databases"
                    description="Create a database resource to get started."
                    icon={<Database size={40} />}
                    action={
                        <Button href="/resources/create">
                            Create Resource
                        </Button>
                    }
                />
            ) : (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Database</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {databases.data.map((db) => (
                                <TableRow key={db.uuid}>
                                    <TableCell className="font-medium">
                                        {db.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {db.database_name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {db.database_user}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                db.status === 'active'
                                                    ? 'success'
                                                    : 'secondary'
                                            }
                                        >
                                            {db.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            href={`/databases/${db.uuid}`}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                router.post(
                                                    `/databases/${db.uuid}/backup`,
                                                )
                                            }
                                        >
                                            Backup
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                router.post(
                                                    `/databases/${db.uuid}/reset-password`,
                                                )
                                            }
                                        >
                                            Reset Password
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
