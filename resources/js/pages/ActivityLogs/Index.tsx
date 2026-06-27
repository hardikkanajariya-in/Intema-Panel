import { Head } from '@inertiajs/react';

import { EmptyState } from '@/components/EmptyState';
import { Activity } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';
import type { ActivityLogEntry } from '@/types/dashboard';
import type { PaginatedData } from '@/types/pagination';

interface ActivityLogsIndexProps {
    logs: PaginatedData<ActivityLogEntry>;
}

function statusVariant(
    status: string,
): 'success' | 'destructive' | 'secondary' {
    return status === 'success'
        ? 'success'
        : status === 'failed'
          ? 'destructive'
          : 'secondary';
}

export default function ActivityLogsIndex({ logs }: ActivityLogsIndexProps) {
    return (
        <AppLayout>
            <Head title="Activity Logs" />

            <PageHeader
                title="Activity Logs"
                description="Audit trail of panel operations"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Activity Logs' },
                ]}
            />

            {logs.data.length === 0 ? (
                <EmptyState
                    title="No activity yet"
                    description="Operations performed in the panel will appear here."
                    icon={<Activity size={40} />}
                />
            ) : (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-xs">
                                        {log.action}
                                    </TableCell>
                                    <TableCell>{log.description}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {log.actor ?? 'System'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusVariant(log.status)}
                                        >
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {log.created_at
                                            ? new Date(
                                                  log.created_at,
                                              ).toLocaleString()
                                            : '—'}
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
