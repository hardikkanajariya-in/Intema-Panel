import { Head, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

import { ClientForm } from '@/components/ClientForm';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/layouts/AppLayout';
import type { ClientFormData, ClientStatus } from '@/types/client';

interface ClientsCreateProps {
    statuses: ClientStatus[];
}

const initialData: ClientFormData = {
    company_name: '',
    domain: '',
    database_name: '',
    database_user: '',
    database_password: '',
    status: 'active',
    notes: '',
};

export default function ClientsCreate({ statuses }: ClientsCreateProps) {
    const { data, setData, post, processing, errors } = useForm<ClientFormData>(initialData);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/clients');
    };

    return (
        <AppLayout>
            <Head title="Add Client" />

            <PageHeader
                title="Add Client"
                description="Create a new hosted client project"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Clients', href: '/clients' },
                    { title: 'Add Client' },
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
                />

                <div className="flex gap-3">
                    <Button type="submit" disabled={processing}>
                        Create Client
                    </Button>
                    <Button type="button" variant="outline" href="/clients">
                        Cancel
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
