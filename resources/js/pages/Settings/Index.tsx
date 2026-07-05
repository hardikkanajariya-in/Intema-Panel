import { Head, useForm } from '@inertiajs/react';
import type {FormEvent, ReactNode} from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import AppLayout from '@/layouts/AppLayout';
import type { PanelSettings } from '@/types/panel';

interface SettingsIndexProps {
    settings: PanelSettings;
    timezones: string[];
}

export default function SettingsIndex({
    settings,
    timezones,
}: SettingsIndexProps) {
    const { data, setData, put, processing, errors } =
        useForm<PanelSettings>(settings);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put('/settings');
    };

    return (
        <AppLayout>
            <Head title="Settings" />

            <PageHeader
                title="Settings"
                description="Configure panel branding and defaults"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Settings' },
                ]}
            />

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>
                            Panel identity and contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Panel Name"
                            id="panel_name"
                            required
                            error={errors.panel_name}
                        >
                            <Input
                                id="panel_name"
                                value={data.panel_name}
                                onChange={(e) =>
                                    setData('panel_name', e.target.value)
                                }
                                error={errors.panel_name}
                            />
                        </Field>
                        <Field
                            label="Support Email"
                            id="support_email"
                            required
                            error={errors.support_email}
                        >
                            <Input
                                id="support_email"
                                type="email"
                                value={data.support_email}
                                onChange={(e) =>
                                    setData('support_email', e.target.value)
                                }
                                error={errors.support_email}
                            />
                        </Field>
                        <Field
                            label="GitHub Personal Access Token (for imports & webhooks)"
                            id="github_token"
                            error={errors.github_token}
                        >
                            <Input
                                id="github_token"
                                type="password"
                                placeholder="ghp_..."
                                value={data.github_token || ''}
                                onChange={(e) =>
                                    setData('github_token', e.target.value)
                                }
                                error={errors.github_token}
                            />
                        </Field>
                        <Field
                            label="Cloudflare API Token (for DNS records management)"
                            id="cloudflare_token"
                            error={errors.cloudflare_token}
                        >
                            <Input
                                id="cloudflare_token"
                                type="password"
                                placeholder="Cloudflare API Token"
                                value={data.cloudflare_token || ''}
                                onChange={(e) =>
                                    setData('cloudflare_token', e.target.value)
                                }
                                error={errors.cloudflare_token}
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Defaults</CardTitle>
                        <CardDescription>
                            Regional and provisioning defaults
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Timezone"
                            id="timezone"
                            required
                            error={errors.timezone}
                        >
                            <Select
                                id="timezone"
                                value={data.timezone}
                                onChange={(e) =>
                                    setData('timezone', e.target.value)
                                }
                                error={errors.timezone}
                            >
                                {timezones.map((timezone) => (
                                    <option key={timezone} value={timezone}>
                                        {timezone}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <Field
                            label="Default Database Prefix"
                            id="default_database_prefix"
                            required
                            error={errors.default_database_prefix}
                        >
                            <Input
                                id="default_database_prefix"
                                value={data.default_database_prefix}
                                onChange={(e) =>
                                    setData(
                                        'default_database_prefix',
                                        e.target.value,
                                    )
                                }
                                error={errors.default_database_prefix}
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Button type="submit" disabled={processing}>
                    Save Settings
                </Button>
            </form>
        </AppLayout>
    );
}

function Field({
    label,
    id,
    required,
    children,
}: {
    label: string;
    id: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} required={required}>
                {label}
            </Label>
            {children}
        </div>
    );
}
