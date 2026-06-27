import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { Pencil } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { Badge, clientStatusVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type { Client } from '@/types/client';

interface ClientsShowProps {
    client: Client;
}

export default function ClientsShow({ client }: ClientsShowProps) {
    return (
        <AppLayout>
            <Head title={client.company_name} />

            <PageHeader
                title={client.company_name}
                description={client.domain}
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Clients', href: '/clients' },
                    { title: client.company_name },
                ]}
                actions={
                    <Button href={`/clients/${client.id}/edit`}>
                        <Pencil size={16} />
                        Edit Client
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Client Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailRow label="Company" value={client.company_name} />
                        <DetailRow label="Domain" value={client.domain} />
                        <DetailRow
                            label="Status"
                            value={
                                <Badge variant={clientStatusVariant(client.status)}>
                                    {client.status}
                                </Badge>
                            }
                        />
                        <DetailRow label="Notes" value={client.notes ?? '—'} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Database Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailRow label="Database Name" value={client.database_name ?? '—'} />
                        <DetailRow label="Database User" value={client.database_user ?? '—'} />
                        <DetailRow label="Password" value="••••••••" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

interface DetailRowProps {
    label: string;
    value: ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value}</span>
        </div>
    );
}
