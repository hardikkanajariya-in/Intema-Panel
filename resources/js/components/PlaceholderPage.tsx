import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';

interface PlaceholderPageProps {
    title: string;
    description: string;
    icon: ReactNode;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
    return (
        <AppLayout>
            <Head title={title} />

            <PageHeader
                title={title}
                description={description}
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: title },
                ]}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This module is part of the application foundation</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-12 text-center">
                    <div className="mb-4 text-muted-foreground">{icon}</div>
                    <p className="max-w-md text-sm text-muted-foreground">
                        The {title} module scaffolding is in place. Business logic and server
                        integrations will be implemented in future iterations.
                    </p>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
