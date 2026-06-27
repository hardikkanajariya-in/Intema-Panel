import { Head, router, useForm } from '@inertiajs/react';
import type {FormEvent} from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import AppLayout from '@/layouts/AppLayout';

interface NginxIndexProps {
    sites: string[];
    errorLog: string;
}

export default function NginxIndex({ sites, errorLog }: NginxIndexProps) {
    const { data, setData, post, processing } = useForm({
        domain: '',
        root: '/var/www/html',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/nginx');
    };

    return (
        <AppLayout>
            <Head title="Nginx" />
            <PageHeader
                title="Nginx"
                description="Virtual host management"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Nginx' },
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.post('/nginx/actions/test')}
                        >
                            Test Config
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.post('/nginx/actions/reload')}
                        >
                            Reload
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.post('/nginx/actions/restart')
                            }
                        >
                            Restart
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Virtual Host</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="domain">Domain</Label>
                                <Input
                                    id="domain"
                                    value={data.domain}
                                    onChange={(e) =>
                                        setData('domain', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="root">Document Root</Label>
                                <Input
                                    id="root"
                                    value={data.root}
                                    onChange={(e) =>
                                        setData('root', e.target.value)
                                    }
                                />
                            </div>
                            <Button type="submit" disabled={processing}>
                                Create & Enable
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sites</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {sites.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No sites configured.
                            </p>
                        ) : (
                            sites.map((site) => (
                                <div
                                    key={site}
                                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                                >
                                    <span>{site}</span>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                router.post(
                                                    `/nginx/${site}/enable`,
                                                )
                                            }
                                        >
                                            Enable
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                router.post(
                                                    `/nginx/${site}/disable`,
                                                )
                                            }
                                        >
                                            Disable
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                router.delete(`/nginx/${site}`)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Error Log (last 50 lines)</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-4 text-xs">
                        {errorLog || 'No log output.'}
                    </pre>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
