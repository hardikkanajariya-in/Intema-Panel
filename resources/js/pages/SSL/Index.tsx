import { Head, router, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';

interface Certificate {
    domain: string;
    expiry: string;
}

interface SslIndexProps {
    certificates: Certificate[];
    defaultEmail: string;
}

export default function SslIndex({ certificates, defaultEmail }: SslIndexProps) {
    const { data, setData, post, processing } = useForm({ domain: '', email: defaultEmail });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/ssl');
    };

    return (
        <AppLayout>
            <Head title="SSL" />
            <PageHeader title="SSL Certificates" description="Let's Encrypt certificate management" breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'SSL' }]} actions={<Button variant="outline" onClick={() => router.post('/ssl/renew', {})}>Renew All</Button>} />

            <Card className="mb-6">
                <CardHeader><CardTitle>Obtain Certificate</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
                        <div><Label htmlFor="domain">Domain</Label><Input id="domain" value={data.domain} onChange={(e) => setData('domain', e.target.value)} /></div>
                        <div><Label htmlFor="email">Email</Label><Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} /></div>
                        <div className="flex items-end"><Button type="submit" disabled={processing}>Generate</Button></div>
                    </form>
                </CardContent>
            </Card>

            <div className="rounded-xl border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader><TableRow><TableHead>Domain</TableHead><TableHead>Expiry</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {certificates.map((cert) => (
                            <TableRow key={cert.domain}>
                                <TableCell>{cert.domain}</TableCell>
                                <TableCell>{cert.expiry}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button size="sm" variant="outline" onClick={() => router.post('/ssl/renew', { domain: cert.domain })}>Renew</Button>
                                        <Button size="sm" variant="outline" onClick={() => router.delete(`/ssl/${cert.domain}`)}>Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
