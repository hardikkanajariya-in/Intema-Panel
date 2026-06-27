import { Head, router } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type { Application } from '@/types/resource';

interface ApplicationsShowProps {
    application: Application;
    deployments: Array<{ uuid: string; status_label: string; branch: string; deployed_at: string | null }>;
}

export default function ApplicationsShow({ application, deployments }: ApplicationsShowProps) {
    return (
        <AppLayout>
            <Head title={application.name} />
            <PageHeader title={application.name} breadcrumbs={[{ title: 'Applications', href: '/applications' }, { title: application.name }]} actions={
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.post(`/applications/${application.uuid}/health`)}>Health Check</Button>
                    <Button variant="outline" onClick={() => router.post(`/applications/${application.uuid}/repair`)}>Repair</Button>
                </div>
            } />
            <div className="grid gap-6 lg:grid-cols-2">
                <Card><CardHeader><CardTitle>Details</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Type:</span> {application.type_label}</div>
                    <div><span className="text-muted-foreground">Status:</span> <Badge variant="success">{application.status_label}</Badge></div>
                    <div><span className="text-muted-foreground">Repository:</span> {application.repository_url ?? '—'}</div>
                    <div><span className="text-muted-foreground">Deploy Path:</span> {application.deploy_path ?? '—'}</div>
                    <div><span className="text-muted-foreground">Runtime:</span> {application.runtime ?? '—'}</div>
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Deployments</CardTitle></CardHeader><CardContent>
                    {deployments.length === 0 ? <p className="text-sm text-muted-foreground">No deployments yet.</p> : deployments.map((d) => (
                        <div key={d.uuid} className="mb-2 text-sm">{d.branch} — {d.status_label}</div>
                    ))}
                </CardContent></Card>
            </div>
        </AppLayout>
    );
}
