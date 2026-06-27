import { Head, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

import { ClientForm } from '@/components/ClientForm';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/layouts/AppLayout';
import type { Client, ClientFormData, ClientStatus } from '@/types/client';

interface ClientsEditProps {
    client: Client;
    statuses: ClientStatus[];
}

export default function ClientsEdit({ client, statuses }: ClientsEditProps) {
    const { data, setData, put, processing, errors } = useForm<ClientFormData>({
        company_name: client.company_name,
        domain: client.domain,
        database_name: client.database_name ?? '',
        database_user: client.database_user ?? '',
        database_password: '',
        status: client.status,
        notes: client.notes ?? '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/clients/${client.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${client.company_name}`} />

            <PageHeader
                title="Edit Client"
                description={`Update details for ${client.company_name}`}
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Clients', href: '/clients' },
                    { title: client.company_name, href: `/clients/${client.id}` },
                    { title: 'Edit' },
                ]}
            />

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <ClientForm
                    data={data}
                    errors={errors}
                    statuses={statuses}
                    onChange={(field, value) => {
                        setData(field, value);
                    }}
                    isEditing
                    databaseName={client.database_name}
                    databaseUser={client.database_user}
                />

                <div className="flex gap-3">
                    <Button type="submit" disabled={processing}>
                        Save Changes
                    </Button>
                    <Button type="button" variant="outline" href={`/clients/${client.id}`}>
                        Cancel
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
