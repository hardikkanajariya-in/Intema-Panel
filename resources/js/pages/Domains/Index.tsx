import { Head } from '@inertiajs/react';

import { EmptyState } from '@/components/EmptyState';
import { Globe } from '@/components/Icons';
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
import type { Domain } from '@/types/resource';

interface DomainsIndexProps {
    domains: PaginatedData<Domain>;
}

export default function DomainsIndex({ domains }: DomainsIndexProps) {
    return (
        <AppLayout>
            <Head title="Domains" />
            <PageHeader
                title="Domains"
                description="Independent domain resources"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Domains' },
                ]}
                actions={
                    <Button href="/resources/create">Create Resource</Button>
                }
            />
            {domains.data.length === 0 ? (
                <EmptyState
                    title="No domains"
                    description="Create a domain resource to get started."
                    icon={<Globe size={40} />}
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
                                <TableHead>Hostname</TableHead>
                                <TableHead>Document Root</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {domains.data.map((domain) => (
                                <TableRow key={domain.uuid}>
                                    <TableCell className="font-medium">
                                        {domain.hostname}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {domain.document_root ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">
                                            {domain.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            href={`/domains/${domain.uuid}`}
                                        >
                                            View
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
