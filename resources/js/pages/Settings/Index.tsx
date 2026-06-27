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
                            label="Company Name"
                            id="company_name"
                            required
                            error={errors.company_name}
                        >
                            <Input
                                id="company_name"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData('company_name', e.target.value)
                                }
                                error={errors.company_name}
                            />
                        </Field>
                        <Field
                            label="Website"
                            id="website"
                            required
                            error={errors.website}
                        >
                            <Input
                                id="website"
                                value={data.website}
                                onChange={(e) =>
                                    setData('website', e.target.value)
                                }
                                error={errors.website}
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
                            label="GitHub URL"
                            id="github_url"
                            required
                            error={errors.github_url}
                        >
                            <Input
                                id="github_url"
                                value={data.github_url}
                                onChange={(e) =>
                                    setData('github_url', e.target.value)
                                }
                                error={errors.github_url}
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
                            label="Theme"
                            id="theme"
                            required
                            error={errors.theme}
                        >
                            <Select
                                id="theme"
                                value={data.theme}
                                onChange={(e) =>
                                    setData('theme', e.target.value)
                                }
                                error={errors.theme}
                            >
                                <option value="system">System</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
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
                        <Field
                            label="Default Resource Status"
                            id="default_resource_status"
                            required
                            error={errors.default_resource_status}
                        >
                            <Select
                                id="default_resource_status"
                                value={data.default_resource_status}
                                onChange={(e) =>
                                    setData(
                                        'default_resource_status',
                                        e.target.value,
                                    )
                                }
                                error={errors.default_resource_status}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                            </Select>
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
