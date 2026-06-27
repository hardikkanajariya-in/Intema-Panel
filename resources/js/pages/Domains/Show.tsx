import { Head, router } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import AppLayout from '@/layouts/AppLayout';
import type { Domain, SslCertificate } from '@/types/resource';

interface DomainsShowProps {
    domain: Domain;
    sslCertificate: SslCertificate | null;
    availableCertificates: SslCertificate[];
}

export default function DomainsShow({
    domain,
    sslCertificate,
    availableCertificates,
}: DomainsShowProps) {
    const attachSsl = (uuid: string) => {
        if (!uuid) {
return;
}

        router.post(`/domains/${domain.uuid}/attach-ssl`, {
            ssl_certificate_uuid: uuid,
        });
    };

    return (
        <AppLayout>
            <Head title={domain.hostname} />
            <PageHeader
                title={domain.hostname}
                breadcrumbs={[
                    { title: 'Domains', href: '/domains' },
                    { title: domain.hostname },
                ]}
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Domain Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">
                                Nginx Site:
                            </span>{' '}
                            {domain.nginx_site ?? '—'}
                        </div>
                        <div>
                            <span className="text-muted-foreground">
                                Document Root:
                            </span>{' '}
                            {domain.document_root ?? '—'}
                        </div>
                        <div>
                            <span className="text-muted-foreground">
                                Status:
                            </span>{' '}
                            <Badge variant="success">
                                {domain.status_label}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>SSL Certificate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {sslCertificate ? (
                            <>
                                <div>
                                    {sslCertificate.domain_name} —{' '}
                                    {sslCertificate.status_label}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        router.delete(
                                            `/domains/${domain.uuid}/detach-ssl`,
                                        )
                                    }
                                >
                                    Detach SSL
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground">
                                    No SSL certificate attached.
                                </p>
                                {availableCertificates.length > 0 && (
                                    <Select
                                        defaultValue=""
                                        onChange={(e) =>
                                            attachSsl(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Attach certificate...
                                        </option>
                                        {availableCertificates.map((cert) => (
                                            <option
                                                key={cert.uuid}
                                                value={cert.uuid}
                                            >
                                                {cert.domain_name}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
