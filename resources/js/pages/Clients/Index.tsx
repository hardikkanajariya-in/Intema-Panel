import { Head, router } from '@inertiajs/react';

import { Eye, Pencil, Plus, Trash2, Users } from '@/components/Icons';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Badge, clientStatusVariant } from '@/components/ui/Badge';
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
import type { Client } from '@/types/client';
import type { PaginatedData } from '@/types/pagination';

interface ClientsIndexProps {
    clients: PaginatedData<Client>;
}

export default function ClientsIndex({ clients }: ClientsIndexProps) {
    const handleDelete = (client: Client) => {
        if (!window.confirm(`Delete client "${client.company_name}"?`)) {
            return;
        }

        router.delete(`/clients/${client.id}`);
    };

    return (
        <AppLayout>
            <Head title="Clients" />

            <PageHeader
                title="Clients"
                description="Manage hosted client projects"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Clients' },
                ]}
                actions={
                    <Button href="/clients/create">
                        <Plus size={16} />
                        Add Client
                    </Button>
                }
            />

            {clients.data.length === 0 ? (
                <EmptyState
                    title="No clients yet"
                    description="Get started by adding your first hosted client project."
                    icon={<Users size={40} />}
                    action={
                        <Button href="/clients/create">
                            <Plus size={16} />
                            Add Client
                        </Button>
                    }
                />
            ) : (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Domain</TableHead>
                                <TableHead>Database</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.data.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">
                                        {client.company_name}
                                    </TableCell>
                                    <TableCell>{client.domain}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {client.database_name ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={clientStatusVariant(client.status)}>
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" href={`/clients/${client.id}`}>
                                                <Eye size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" href={`/clients/${client.id}/edit`}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    handleDelete(client);
                                                }}
                                            >
                                                <Trash2 size={16} className="text-destructive" />
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
