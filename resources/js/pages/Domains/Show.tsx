import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type { Domain } from '@/types/resource';

interface DomainsShowProps {
    domain: Domain;
}

export default function DomainsShow({ domain }: DomainsShowProps) {
    return (
        <AppLayout>
            <Head title={domain.hostname} />
            <PageHeader title={domain.hostname} breadcrumbs={[{ title: 'Domains', href: '/domains' }, { title: domain.hostname }]} />
            <Card>
                <CardHeader><CardTitle>Domain Details</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Nginx Site:</span> {domain.nginx_site ?? '—'}</div>
                    <div><span className="text-muted-foreground">Document Root:</span> {domain.document_root ?? '—'}</div>
                    <div><span className="text-muted-foreground">Status:</span> <Badge variant="success">{domain.status_label}</Badge></div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
