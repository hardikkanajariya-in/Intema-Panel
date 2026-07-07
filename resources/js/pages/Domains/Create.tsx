import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import AppLayout from '@/layouts/AppLayout';
import type { Project, Application } from '@/types/resource';

interface DomainsCreateProps {
    selectedProject: Project | null;
    selectedApplication: Application | null;
    projects: Project[];
    applications: Application[];
}

export default function DomainsCreate({
    selectedProject,
    selectedApplication,
    projects,
    applications,
}: DomainsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_uuid: selectedProject?.uuid ?? '',
        hostname: '',
        application_id: selectedApplication?.uuid ?? '',
        document_root: '',
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/domains');
    };

    return (
        <AppLayout>
            <Head title="Create Domain" />
            <PageHeader
                title="Create Domain"
                description="Add a new domain name to a project"
                breadcrumbs={[
                    { title: 'Domains', href: '/domains' },
                    { title: 'New' },
                ]}
            />

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Assignment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project_uuid">Project</Label>
                            <Select
                                id="project_uuid"
                                value={data.project_uuid}
                                onChange={(e) => setData('project_uuid', e.target.value)}
                            >
                                <option value="">No project</option>
                                {projects.map((p) => (
                                    <option key={p.uuid} value={p.uuid}>
                                        {p.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.project_uuid && (
                                <p className="text-sm text-destructive">{errors.project_uuid}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Domain Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hostname">Hostname</Label>
                            <Input
                                id="hostname"
                                value={data.hostname}
                                onChange={(e) => setData('hostname', e.target.value)}
                                placeholder="example.com"
                            />
                            {errors.hostname && (
                                <p className="text-sm text-destructive">{errors.hostname}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="application_id">Attach to Application (optional)</Label>
                            <Select
                                id="application_id"
                                value={data.application_id}
                                onChange={(e) => setData('application_id', e.target.value)}
                            >
                                <option value="">None</option>
                                {applications.map((a) => (
                                    <option key={a.uuid} value={a.uuid}>
                                        {a.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.application_id && (
                                <p className="text-sm text-destructive">{errors.application_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="document_root">Document Root (optional)</Label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-muted-foreground text-sm font-mono select-none">
                                    /var/www/
                                </span>
                                <Input
                                    id="document_root"
                                    value={data.document_root.replace(/^\/var\/www\//, '')}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setData('document_root', val ? `/var/www/${val}` : '');
                                    }}
                                    className="rounded-l-none"
                                    placeholder="example.com"
                                />
                            </div>
                            {errors.document_root && (
                                <p className="text-sm text-destructive">{errors.document_root}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Domain'}
                    </Button>
                    <Button variant="outline" href="/domains">
                        Cancel
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
