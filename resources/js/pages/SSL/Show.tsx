import { Head, router } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type { SslCertificate } from '@/types/resource';

interface SslShowProps {
    certificate: SslCertificate;
}

export default function SslShow({ certificate }: SslShowProps) {
    return (
        <AppLayout>
            <Head title={certificate.domain_name} />
            <PageHeader title={certificate.domain_name} breadcrumbs={[{ title: 'SSL', href: '/ssl-certificates' }, { title: certificate.domain_name }]} actions={<Button variant="outline" onClick={() => router.post(`/ssl-certificates/${certificate.uuid}/renew`)}>Renew</Button>} />
            <Card>
                <CardHeader><CardTitle>Certificate Details</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Issuer:</span> {certificate.issuer ?? '—'}</div>
                    <div><span className="text-muted-foreground">Expires:</span> {certificate.expires_at ? new Date(certificate.expires_at).toLocaleString() : '—'}</div>
                    <div><span className="text-muted-foreground">Auto Renew:</span> {certificate.auto_renew ? 'Yes' : 'No'}</div>
                    <div><span className="text-muted-foreground">Status:</span> <Badge variant="success">{certificate.status_label}</Badge></div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
