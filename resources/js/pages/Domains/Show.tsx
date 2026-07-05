import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';
import type { Domain, SslCertificate } from '@/types/resource';

interface DomainsShowProps {
    domain: Domain;
    sslCertificate: SslCertificate | null;
    availableCertificates: SslCertificate[];
    cloudflareConfigured: boolean;
}

export default function DomainsShow({
    domain,
    sslCertificate,
    availableCertificates,
    cloudflareConfigured,
}: DomainsShowProps) {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addingRecord, setAddingRecord] = useState(false);

    // Form state
    const [type, setType] = useState('A');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [ttl, setTtl] = useState(1);
    const [proxied, setProxied] = useState(true);

    const fetchRecords = async () => {
        if (!cloudflareConfigured) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/domains/${domain.uuid}/dns-records`);
            const data = await res.json();
            if (data.success) {
                setRecords(data.records);
            } else {
                setError(data.message || 'Failed to fetch DNS records.');
            }
        } catch (e: any) {
            setError(e.message || 'An error occurred while fetching DNS records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [domain.uuid]);

    const attachSsl = (uuid: string) => {
        if (!uuid) return;
        router.post(`/domains/${domain.uuid}/attach-ssl`, {
            ssl_certificate_uuid: uuid,
        });
    };

    const handleAddRecord = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const response = await fetch(`/domains/${domain.uuid}/dns-records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ type, name, content, ttl, proxied }),
            });
            const result = await response.json();
            if (result.success) {
                setAddingRecord(false);
                setName('');
                setContent('');
                setType('A');
                setTtl(1);
                setProxied(true);
                fetchRecords();
            } else {
                setError(result.message || 'Failed to create DNS record.');
            }
        } catch (e: any) {
            setError(e.message || 'An error occurred.');
        }
    };

    const handleDeleteRecord = async (recordId: string) => {
        if (!window.confirm('Are you sure you want to delete this DNS record?')) {
            return;
        }
        setError(null);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const response = await fetch(`/domains/${domain.uuid}/dns-records/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            const result = await response.json();
            if (result.success) {
                fetchRecords();
            } else {
                setError(result.message || 'Failed to delete DNS record.');
            }
        } catch (e: any) {
            setError(e.message || 'An error occurred.');
        }
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
            <div className="space-y-6">
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

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle>Cloudflare DNS Records</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Manage the DNS Zone records for this domain on Cloudflare.
                            </p>
                        </div>
                        {cloudflareConfigured && (
                            <Button
                                size="sm"
                                onClick={() => setAddingRecord(!addingRecord)}
                            >
                                {addingRecord ? 'Cancel' : 'Add Record'}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {!cloudflareConfigured ? (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm">
                                <p className="text-muted-foreground">
                                    Cloudflare integration is not configured.
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Add your Cloudflare API Token in Settings to enable DNS management.
                                </p>
                            </div>
                        ) : addingRecord ? (
                            <form onSubmit={handleAddRecord} className="space-y-4 rounded-lg border border-border p-4 bg-muted/40 max-w-xl">
                                <h4 className="text-sm font-semibold">New DNS Record</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="dns_type">Type</Label>
                                        <Select
                                            id="dns_type"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                            <option value="A">A</option>
                                            <option value="AAAA">AAAA</option>
                                            <option value="CNAME">CNAME</option>
                                            <option value="TXT">TXT</option>
                                            <option value="MX">MX</option>
                                            <option value="NS">NS</option>
                                            <option value="SRV">SRV</option>
                                            <option value="CAA">CAA</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="dns_name">Name</Label>
                                        <Input
                                            id="dns_name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. @ or www"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="dns_content">Content / Value</Label>
                                    <Input
                                        id="dns_content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="e.g. 192.168.1.1"
                                        required
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 items-center">
                                    <div>
                                        <Label htmlFor="dns_ttl">TTL</Label>
                                        <Select
                                            id="dns_ttl"
                                            value={String(ttl)}
                                            onChange={(e) => setTtl(Number(e.target.value))}
                                        >
                                            <option value="1">Auto</option>
                                            <option value="60">1 min</option>
                                            <option value="300">5 min</option>
                                            <option value="600">10 min</option>
                                            <option value="1800">30 min</option>
                                            <option value="3600">1 hour</option>
                                        </Select>
                                    </div>
                                    {['A', 'AAAA', 'CNAME'].includes(type) && (
                                        <div className="flex items-center space-x-2 pt-5">
                                            <input
                                                type="checkbox"
                                                id="dns_proxied"
                                                checked={proxied}
                                                onChange={(e) => setProxied(e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="dns_proxied" className="cursor-pointer">Proxied (Cloudflare CDN)</Label>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" size="sm">Save Record</Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setAddingRecord(false)}>Cancel</Button>
                                </div>
                            </form>
                        ) : loading ? (
                            <div className="text-center py-6 text-sm text-muted-foreground">
                                Fetching DNS records from Cloudflare...
                            </div>
                        ) : records.length === 0 ? (
                            <div className="text-center py-6 text-sm text-muted-foreground">
                                No DNS records found for this domain on Cloudflare.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Value</TableHead>
                                            <TableHead>TTL</TableHead>
                                            <TableHead>Proxy status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {records.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="font-semibold">{record.type}</TableCell>
                                                <TableCell>{record.name}</TableCell>
                                                <TableCell className="max-w-xs truncate" title={record.content}>
                                                    {record.content}
                                                </TableCell>
                                                <TableCell>
                                                    {record.ttl === 1 ? 'Auto' : `${record.ttl}s`}
                                                </TableCell>
                                                <TableCell>
                                                    {record.proxied ? (
                                                        <Badge variant="success">Proxied</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">DNS Only</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive/80"
                                                        onClick={() => handleDeleteRecord(record.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
