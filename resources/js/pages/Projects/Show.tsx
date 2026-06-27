import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type {
    Application,
    Domain,
    ManagedDatabase,
    Project,
} from '@/types/resource';

interface ProjectsShowProps {
    project: Project;
    applications: Application[];
    databases: ManagedDatabase[];
    domains: Domain[];
}

export default function ProjectsShow({
    project,
    applications,
    databases,
    domains,
}: ProjectsShowProps) {
    return (
        <AppLayout>
            <Head title={project.name} />
            <PageHeader
                title={project.name}
                description={project.description ?? 'Project overview'}
                breadcrumbs={[
                    { title: 'Projects', href: '/projects' },
                    { title: project.name },
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button
                            href={`/resources/create?project=${project.uuid}`}
                        >
                            Add Resource
                        </Button>
                        <Button
                            variant="outline"
                            href={`/projects/${project.uuid}/edit`}
                        >
                            Edit
                        </Button>
                    </div>
                }
            />
            <div className="mb-6">
                <Badge variant="success">{project.status_label}</Badge>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Applications ({applications.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {applications.map((a) => (
                            <div key={a.uuid}>
                                <Button
                                    variant="ghost"
                                    href={`/applications/${a.uuid}`}
                                >
                                    {a.name}
                                </Button>
                            </div>
                        ))}
                        {applications.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                None
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Databases ({databases.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {databases.map((d) => (
                            <div key={d.uuid}>
                                <Button
                                    variant="ghost"
                                    href={`/databases/${d.uuid}`}
                                >
                                    {d.name}
                                </Button>
                            </div>
                        ))}
                        {databases.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                None
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Domains ({domains.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {domains.map((d) => (
                            <div key={d.uuid}>
                                <Button
                                    variant="ghost"
                                    href={`/domains/${d.uuid}`}
                                >
                                    {d.hostname}
                                </Button>
                            </div>
                        ))}
                        {domains.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                None
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
