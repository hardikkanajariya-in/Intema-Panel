import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import AppLayout from '@/layouts/AppLayout';
import type { Project, ApplicationTypeOption } from '@/types/resource';

interface GithubRepo {
    name: string;
    clone_url: string;
    ssh_url: string;
    private: boolean;
    default_branch: string;
}

interface ApplicationsCreateProps {
    selectedProject: Project | null;
    projects: Project[];
    applicationTypes: ApplicationTypeOption[];
    githubConnected: boolean;
}

export default function ApplicationsCreate({
    selectedProject,
    projects,
    applicationTypes,
    githubConnected,
}: ApplicationsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_uuid: selectedProject?.uuid ?? '',
        name: '',
        type: 'laravel',
        repository_url: '',
        repository_branch: 'main',
        deploy_path: '',
        runtime: 'php8.4',
        linux_user: '',
        domain: '',
        document_root: '',
        generate_ssl: false,
        notes: '',
        provision: true,
    });

    const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
    const [githubBranches, setGithubBranches] = useState<string[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [isManualGit, setIsManualGit] = useState(!githubConnected);
    const [selectedRepo, setSelectedRepo] = useState('');

    useEffect(() => {
        if (githubConnected) {
            setLoadingRepos(true);
            fetch('/github/repositories')
                .then((res) => res.json())
                .then((resData) => {
                    if (Array.isArray(resData)) {
                        setGithubRepos(resData);
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => setLoadingRepos(false));
        }
    }, [githubConnected]);

    const handleRepoChange = (repoName: string) => {
        setSelectedRepo(repoName);
        const repo = githubRepos.find((r) => r.name === repoName);
        if (!repo) return;

        const nameOnly = repo.name.split('/')[1];
        const host = window.location.hostname;
        const baseDomain = host.replace(/^(hpanel|panel)\./, '');
        const suggestedDomain = `${nameOnly}.${baseDomain}`;
        
        const suggestedDocRoot = data.type === 'laravel' 
            ? `/var/www/${nameOnly}/public` 
            : `/var/www/${nameOnly}`;

        setData((prev) => ({
            ...prev,
            name: nameOnly,
            repository_url: repo.clone_url,
            repository_branch: repo.default_branch,
            deploy_path: `/var/www/${nameOnly}`,
            domain: suggestedDomain,
            document_root: suggestedDocRoot,
        }));

        setLoadingBranches(true);
        setGithubBranches([]);
        fetch(`/github/branches?repo=${encodeURIComponent(repoName)}`)
            .then((res) => res.json())
            .then((resData) => {
                if (Array.isArray(resData)) {
                    setGithubBranches(resData);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoadingBranches(false));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/applications');
    };

    return (
        <AppLayout>
            <Head title="Create Application" />
            <PageHeader
                title="Create Application"
                description="Add a new application to a project"
                breadcrumbs={[
                    { title: 'Applications', href: '/applications' },
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

                {githubConnected && (
                    <Card>
                        <CardHeader>
                            <CardTitle>GitHub Integration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-muted-foreground">Select repository source</Label>
                                <button
                                    type="button"
                                    onClick={() => setIsManualGit(!isManualGit)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    {isManualGit ? 'Import from GitHub' : 'Use manual Git URL'}
                                </button>
                            </div>
                            {!isManualGit && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="repo_select">Repository</Label>
                                        {loadingRepos ? (
                                            <p className="text-xs text-muted-foreground animate-pulse">Loading repositories...</p>
                                        ) : (
                                            <Select
                                                id="repo_select"
                                                value={selectedRepo}
                                                onChange={(e) => handleRepoChange(e.target.value)}
                                            >
                                                <option value="">Select a repository...</option>
                                                {githubRepos.map((repo) => (
                                                    <option key={repo.name} value={repo.name}>
                                                        {repo.name} {repo.private ? '(Private)' : ''}
                                                    </option>
                                                ))}
                                            </Select>
                                        )}
                                    </div>

                                    {selectedRepo && (
                                        <div className="space-y-2">
                                            <Label htmlFor="branch_select">Branch</Label>
                                            {loadingBranches ? (
                                                <p className="text-xs text-muted-foreground animate-pulse">Loading branches...</p>
                                            ) : (
                                                <Select
                                                    id="branch_select"
                                                    value={data.repository_branch}
                                                    onChange={(e) => setData('repository_branch', e.target.value)}
                                                >
                                                    {githubBranches.map((branch) => (
                                                        <option key={branch} value={branch}>
                                                            {branch}
                                                        </option>
                                                    ))}
                                                    {githubBranches.length === 0 && (
                                                        <option value={data.repository_branch}>
                                                            {data.repository_branch}
                                                        </option>
                                                    )}
                                                </Select>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Application Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => {
                                    const nameOnly = e.target.value;
                                    const host = window.location.hostname;
                                    const baseDomain = host.replace(/^(hpanel|panel)\./, '');
                                    const suggestedDomain = nameOnly ? `${nameOnly}.${baseDomain}` : '';
                                    const suggestedDocRoot = nameOnly 
                                        ? (data.type === 'laravel' ? `/var/www/${nameOnly}/public` : `/var/www/${nameOnly}`)
                                        : '';
                                    setData((prev) => ({
                                        ...prev,
                                        name: nameOnly,
                                        deploy_path: nameOnly ? `/var/www/${nameOnly}` : '',
                                        domain: suggestedDomain,
                                        document_root: suggestedDocRoot,
                                    }));
                                }}
                                placeholder="my-cool-app"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Framework</Label>
                            <Select
                                id="type"
                                value={data.type}
                                onChange={(e) => {
                                    const nextType = e.target.value;
                                    const nameOnly = data.name;
                                    const suggestedDocRoot = nameOnly 
                                        ? (nextType === 'laravel' ? `/var/www/${nameOnly}/public` : `/var/www/${nameOnly}`)
                                        : '';
                                    setData((prev) => ({
                                        ...prev,
                                        type: nextType,
                                        document_root: suggestedDocRoot,
                                    }));
                                }}
                            >
                                {applicationTypes.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-destructive">{errors.type}</p>
                            )}
                        </div>

                        {isManualGit && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="repository_url">Repository URL</Label>
                                    <Input
                                        id="repository_url"
                                        value={data.repository_url}
                                        onChange={(e) => setData('repository_url', e.target.value)}
                                        placeholder="git@github.com:username/repo.git"
                                    />
                                    {errors.repository_url && (
                                        <p className="text-sm text-destructive">{errors.repository_url}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="repository_branch">Repository Branch</Label>
                                    <Input
                                        id="repository_branch"
                                        value={data.repository_branch}
                                        onChange={(e) => setData('repository_branch', e.target.value)}
                                        placeholder="main"
                                    />
                                    {errors.repository_branch && (
                                        <p className="text-sm text-destructive">{errors.repository_branch}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="deploy_path">Deploy Path</Label>
                            <Input
                                id="deploy_path"
                                value={data.deploy_path}
                                onChange={(e) => setData('deploy_path', e.target.value)}
                                placeholder="/var/www/my-cool-app"
                            />
                            {errors.deploy_path && (
                                <p className="text-sm text-destructive">{errors.deploy_path}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="runtime">Runtime</Label>
                            <Input
                                id="runtime"
                                value={data.runtime}
                                onChange={(e) => setData('runtime', e.target.value)}
                            />
                            {errors.runtime && (
                                <p className="text-sm text-destructive">{errors.runtime}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="domain">Domain (optional)</Label>
                            <Input
                                id="domain"
                                value={data.domain}
                                onChange={(e) => setData('domain', e.target.value)}
                                placeholder="my-cool-app.com"
                            />
                            {errors.domain && (
                                <p className="text-sm text-destructive">{errors.domain}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="document_root">Document Root (optional)</Label>
                            <Input
                                id="document_root"
                                value={data.document_root}
                                onChange={(e) => setData('document_root', e.target.value)}
                                placeholder="/var/www/my-cool-app/public"
                            />
                            {errors.document_root && (
                                <p className="text-sm text-destructive">{errors.document_root}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="generate_ssl"
                                type="checkbox"
                                checked={data.generate_ssl}
                                onChange={(e) => setData('generate_ssl', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="generate_ssl">Generate SSL Certificate via Let's Encrypt</Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="provision"
                                type="checkbox"
                                checked={data.provision}
                                onChange={(e) => setData('provision', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="provision">Provision configuration & directories on server</Label>
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
                        {processing ? 'Creating...' : 'Create Application'}
                    </Button>
                    <Button variant="outline" href="/applications">
                        Cancel
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
