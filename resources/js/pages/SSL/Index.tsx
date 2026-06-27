import { Head, router } from '@inertiajs/react';

import { EmptyState } from '@/components/EmptyState';
import { Shield } from '@/components/Icons';
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
import type { SslCertificate } from '@/types/resource';

interface SslIndexProps {
    certificates: PaginatedData<SslCertificate>;
    systemCertificates: Array<{ domain: string; expiry: string }>;
}

export default function SslIndex({
    certificates,
    systemCertificates,
}: SslIndexProps) {
    return (
        <AppLayout>
            <Head title="SSL Certificates" />
            <PageHeader
                title="SSL Certificates"
                description="Independent SSL certificate resources"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'SSL' },
                ]}
                actions={
                    <Button href="/resources/create">Create Resource</Button>
                }
            />
            {certificates.data.length === 0 ? (
                <EmptyState
                    title="No certificates"
                    description="Create an SSL certificate resource to get started."
                    icon={<Shield size={40} />}
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
                                <TableHead>Domain</TableHead>
                                <TableHead>Issuer</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.data.map((cert) => (
                                <TableRow key={cert.uuid}>
                                    <TableCell className="font-medium">
                                        {cert.domain_name}
                                    </TableCell>
                                    <TableCell>{cert.issuer ?? '—'}</TableCell>
                                    <TableCell>
                                        {cert.expires_at
                                            ? new Date(
                                                  cert.expires_at,
                                              ).toLocaleDateString()
                                            : '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">
                                            {cert.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            href={`/ssl-certificates/${cert.uuid}`}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                router.post(
                                                    `/ssl-certificates/${cert.uuid}/renew`,
                                                )
                                            }
                                        >
                                            Renew
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {systemCertificates.length > 0 && (
                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold">
                        System Certificates
                    </h3>
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Expiry</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {systemCertificates.map((cert) => (
                                    <TableRow key={cert.domain}>
                                        <TableCell>{cert.domain}</TableCell>
                                        <TableCell>{cert.expiry}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
