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

interface DatabasesCreateProps {
    selectedProject: Project | null;
    selectedApplication: Application | null;
    projects: Project[];
    applications: Application[];
}

export default function DatabasesCreate({
    selectedProject,
    selectedApplication,
    projects,
    applications,
}: DatabasesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_uuid: selectedProject?.uuid ?? '',
        name: '',
        application_id: selectedApplication?.uuid ?? '',
        database_name: '',
        database_user: '',
        provision: true,
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/databases');
    };

    return (
        <AppLayout>
            <Head title="Create Database" />
            <PageHeader
                title="Create Database"
                description="Add a new database to a project"
                breadcrumbs={[
                    { title: 'Databases', href: '/databases' },
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
                        <CardTitle>Database Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="my-db"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
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
                            <Label htmlFor="database_name">Database Name (optional)</Label>
                            <Input
                                id="database_name"
                                value={data.database_name}
                                onChange={(e) => setData('database_name', e.target.value)}
                                placeholder="Auto-generated if empty"
                            />
                            {errors.database_name && (
                                <p className="text-sm text-destructive">{errors.database_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="database_user">Database User (optional)</Label>
                            <Input
                                id="database_user"
                                value={data.database_user}
                                onChange={(e) => setData('database_user', e.target.value)}
                                placeholder="Auto-generated if empty"
                            />
                            {errors.database_user && (
                                <p className="text-sm text-destructive">{errors.database_user}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="provision"
                                type="checkbox"
                                checked={data.provision}
                                onChange={(e) => setData('provision', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="provision">Provision on PostgreSQL database server</Label>
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
                        {processing ? 'Creating...' : 'Create Database'}
                    </Button>
                    <Button variant="outline" href="/databases">
                        Cancel
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
