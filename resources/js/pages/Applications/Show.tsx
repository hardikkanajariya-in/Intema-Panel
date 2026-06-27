import { Head, router } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import AppLayout from '@/layouts/AppLayout';
import type { Application, Domain, ManagedDatabase } from '@/types/resource';

interface RuntimeOperation {
    key: string;
    label: string;
}

interface ApplicationsShowProps {
    application: Application;
    deployments: Array<{ uuid: string; status_label: string; branch: string; deployed_at: string | null }>;
    runtimeOperations: RuntimeOperation[];
    databases: ManagedDatabase[];
    domains: Domain[];
    availableDatabases: ManagedDatabase[];
    availableDomains: Domain[];
}

export default function ApplicationsShow({
    application,
    deployments,
    runtimeOperations,
    databases,
    domains,
    availableDatabases,
    availableDomains,
}: ApplicationsShowProps) {
    const runRuntime = (operation: string) => {
        router.post(`/applications/${application.uuid}/runtime`, { operation });
    };

    const attachDatabase = (databaseUuid: string) => {
        if (!databaseUuid) return;
        router.post(`/applications/${application.uuid}/attach-database`, { database_uuid: databaseUuid });
    };

    const attachDomain = (domainUuid: string) => {
        if (!domainUuid) return;
        router.post(`/applications/${application.uuid}/attach-domain`, { domain_uuid: domainUuid });
    };

    return (
        <AppLayout>
            <Head title={application.name} />
            <PageHeader
                title={application.name}
                breadcrumbs={[{ title: 'Applications', href: '/applications' }, { title: application.name }]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.post(`/applications/${application.uuid}/health`)}>Health Check</Button>
                        <Button variant="outline" onClick={() => router.post(`/applications/${application.uuid}/repair`)}>Repair</Button>
                        {application.repository_url && application.deploy_path && (
                            <Button onClick={() => router.post(`/applications/${application.uuid}/deploy`)}>Deploy</Button>
                        )}
                    </div>
                }
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div><span className="text-muted-foreground">Type:</span> {application.type_label}</div>
                        <div><span className="text-muted-foreground">Status:</span> <Badge variant="success">{application.status_label}</Badge></div>
                        <div><span className="text-muted-foreground">Repository:</span> {application.repository_url ?? '—'}</div>
                        <div><span className="text-muted-foreground">Deploy Path:</span> {application.deploy_path ?? '—'}</div>
                        <div><span className="text-muted-foreground">Runtime:</span> {application.runtime ?? '—'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Runtime Operations</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {runtimeOperations.map((op) => (
                            <Button key={op.key} size="sm" variant="outline" onClick={() => runRuntime(op.key)}>{op.label}</Button>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Databases ({databases.length})</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {databases.map((db) => (
                            <div key={db.uuid} className="flex items-center justify-between text-sm">
                                <Button variant="ghost" href={`/databases/${db.uuid}`}>{db.name}</Button>
                                <Button size="sm" variant="outline" onClick={() => router.delete(`/applications/${application.uuid}/databases/${db.uuid}`)}>Detach</Button>
                            </div>
                        ))}
                        {availableDatabases.filter((d) => !d.application_id).length > 0 && (
                            <div className="flex gap-2">
                                <Select id="attach-db" defaultValue="" onChange={(e) => attachDatabase(e.target.value)}>
                                    <option value="">Attach database...</option>
                                    {availableDatabases.filter((d) => !d.application_id).map((d) => (
                                        <option key={d.uuid} value={d.uuid}>{d.name}</option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Domains ({domains.length})</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {domains.map((domain) => (
                            <div key={domain.uuid} className="flex items-center justify-between text-sm">
                                <Button variant="ghost" href={`/domains/${domain.uuid}`}>{domain.hostname}</Button>
                                <Button size="sm" variant="outline" onClick={() => router.delete(`/applications/${application.uuid}/domains/${domain.uuid}`)}>Detach</Button>
                            </div>
                        ))}
                        {availableDomains.filter((d) => !d.application_id).length > 0 && (
                            <Select id="attach-domain" defaultValue="" onChange={(e) => attachDomain(e.target.value)}>
                                <option value="">Attach domain...</option>
                                {availableDomains.filter((d) => !d.application_id).map((d) => (
                                    <option key={d.uuid} value={d.uuid}>{d.hostname}</option>
                                ))}
                            </Select>
                        )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Deployments</CardTitle></CardHeader>
                    <CardContent>
                        {deployments.length === 0 ? <p className="text-sm text-muted-foreground">No deployments yet.</p> : deployments.map((d) => (
                            <div key={d.uuid} className="mb-2 text-sm">{d.branch} — {d.status_label} {d.deployed_at ? `(${new Date(d.deployed_at).toLocaleString()})` : ''}</div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
