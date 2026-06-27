import { Head, router, useForm } from '@inertiajs/react';
import { useState  } from 'react';
import type {FormEvent} from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import AppLayout from '@/layouts/AppLayout';
import type {
    Application,
    ApplicationTypeOption,
    Domain,
    Project,
} from '@/types/resource';

interface WizardProps {
    step: number;
    selectedProject: Project | null;
    resourceType: string | null;
    projects: Project[];
    applicationTypes: ApplicationTypeOption[];
    applications: Application[];
    domains: Domain[];
}

const resourceTypes = [
    { value: 'application', label: 'Application' },
    { value: 'database', label: 'Database' },
    { value: 'domain', label: 'Domain' },
    { value: 'ssl', label: 'SSL Certificate' },
];

export default function ResourceWizard({
    step,
    selectedProject,
    resourceType,
    projects,
    applicationTypes,
    applications,
    domains,
}: WizardProps) {
    const [currentStep, setCurrentStep] = useState(step);
    const [projectUuid, setProjectUuid] = useState(selectedProject?.uuid ?? '');
    const [type, setType] = useState(resourceType ?? '');

    const { data, setData, post, processing, errors } = useForm({
        resource_type: type,
        project_uuid: projectUuid,
        provision: true,
        name: '',
        type: 'laravel',
        repository_url: '',
        repository_branch: 'main',
        deploy_path: '',
        runtime: 'php8.3',
        linux_user: '',
        domain: '',
        document_root: '',
        generate_ssl: false,
        application_id: '',
        database_name: '',
        database_user: '',
        hostname: '',
        document_root_domain: '',
        provision_nginx: false,
        domain_name: '',
        domain_id: '',
        auto_renew: true,
        notes: '',
    });

    const goToStep = (nextStep: number) => {
        const params = new URLSearchParams();
        params.set('step', String(nextStep));

        if (projectUuid) {
params.set('project', projectUuid);
}

        if (type) {
params.set('type', type);
}

        router.get(`/resources/create?${params.toString()}`);
        setCurrentStep(nextStep);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        router.post('/resources', {
            ...data,
            resource_type: type,
            project_uuid: projectUuid || '',
            document_root:
                type === 'domain'
                    ? data.document_root_domain
                    : data.document_root,
        });
    };

    return (
        <AppLayout>
            <Head title="Create Resource" />
            <PageHeader
                title="Create Resource"
                description="Add a new infrastructure resource"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Create Resource' },
                ]}
            />

            <div className="mb-8 flex gap-2">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`rounded-full px-4 py-1 text-sm ${currentStep === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                        Step {s}
                    </div>
                ))}
            </div>

            {currentStep === 1 && (
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Select Project</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Project (optional)</Label>
                            <Select
                                value={projectUuid}
                                onChange={(e) => setProjectUuid(e.target.value)}
                            >
                                <option value="">No project</option>
                                {projects.map((p) => (
                                    <option key={p.uuid} value={p.uuid}>
                                        {p.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <Button onClick={() => goToStep(2)}>Continue</Button>
                    </CardContent>
                </Card>
            )}

            {currentStep === 2 && (
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Select Resource Type</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            {resourceTypes.map((rt) => (
                                <Button
                                    key={rt.value}
                                    variant={
                                        type === rt.value
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setType(rt.value)}
                                >
                                    {rt.label}
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => goToStep(1)}
                            >
                                Back
                            </Button>
                            <Button
                                disabled={!type}
                                onClick={() => goToStep(3)}
                            >
                                Continue
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {currentStep === 3 && (
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                    <input type="hidden" name="resource_type" value={type} />
                    {type === 'application' && (
                        <>
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Framework</Label>
                                <Select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                >
                                    {applicationTypes.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Repository URL</Label>
                                <Input
                                    value={data.repository_url}
                                    onChange={(e) =>
                                        setData(
                                            'repository_url',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Deploy Path</Label>
                                <Input
                                    value={data.deploy_path}
                                    onChange={(e) =>
                                        setData('deploy_path', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Runtime</Label>
                                <Input
                                    value={data.runtime}
                                    onChange={(e) =>
                                        setData('runtime', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Domain (optional)</Label>
                                <Input
                                    value={data.domain}
                                    onChange={(e) =>
                                        setData('domain', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Document Root (optional)</Label>
                                <Input
                                    value={data.document_root}
                                    onChange={(e) =>
                                        setData('document_root', e.target.value)
                                    }
                                />
                            </div>
                        </>
                    )}
                    {type === 'database' && (
                        <>
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Attach to Application (optional)</Label>
                                <Select
                                    value={data.application_id}
                                    onChange={(e) =>
                                        setData(
                                            'application_id',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">None</option>
                                    {applications.map((a) => (
                                        <option key={a.uuid} value={a.uuid}>
                                            {a.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Database Name (optional)</Label>
                                <Input
                                    value={data.database_name}
                                    onChange={(e) =>
                                        setData('database_name', e.target.value)
                                    }
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                        </>
                    )}
                    {type === 'domain' && (
                        <>
                            <div className="space-y-2">
                                <Label>Hostname</Label>
                                <Input
                                    value={data.hostname}
                                    onChange={(e) =>
                                        setData('hostname', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Target Application (optional)</Label>
                                <Select
                                    value={data.application_id}
                                    onChange={(e) =>
                                        setData(
                                            'application_id',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">None</option>
                                    {applications.map((a) => (
                                        <option key={a.uuid} value={a.uuid}>
                                            {a.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Document Root (optional)</Label>
                                <Input
                                    value={data.document_root_domain}
                                    onChange={(e) =>
                                        setData(
                                            'document_root_domain',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </>
                    )}
                    {type === 'ssl' && (
                        <>
                            <div className="space-y-2">
                                <Label>Domain Name</Label>
                                <Input
                                    value={data.domain_name}
                                    onChange={(e) =>
                                        setData('domain_name', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Target Domain (optional)</Label>
                                <Select
                                    value={data.domain_id}
                                    onChange={(e) =>
                                        setData('domain_id', e.target.value)
                                    }
                                >
                                    <option value="">None</option>
                                    {domains.map((d) => (
                                        <option key={d.uuid} value={d.uuid}>
                                            {d.hostname}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </>
                    )}
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => goToStep(2)}
                        >
                            Back
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Resource
                        </Button>
                    </div>
                </form>
            )}
        </AppLayout>
    );
}
