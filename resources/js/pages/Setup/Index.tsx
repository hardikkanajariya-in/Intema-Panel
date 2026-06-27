import { Head, useForm } from '@inertiajs/react';
import type {FormEvent, ReactNode} from 'react';

import { PanelFooter } from '@/components/PanelFooter';
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

interface SetupDefaults {
    panel_name: string;
    company_name: string;
    website: string;
    github_url: string;
    support_email: string;
    timezone: string;
}

interface SetupForm extends SetupDefaults {
    admin_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface SetupIndexProps {
    defaults: SetupDefaults;
    timezones: string[];
}

export default function SetupIndex({ defaults, timezones }: SetupIndexProps) {
    const { data, setData, post, processing, errors } = useForm<SetupForm>({
        admin_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        ...defaults,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/setup');
    };

    return (
        <>
            <Head title="Setup Wizard" />
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-3xl px-4 py-10">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold">
                            Intema Panel Setup
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Complete the first-boot wizard to configure your
                            hosting control panel
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Administrator Account</CardTitle>
                                <CardDescription>
                                    Create the single panel administrator
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Name"
                                    id="admin_name"
                                    error={errors.admin_name}
                                >
                                    <Input
                                        id="admin_name"
                                        value={data.admin_name}
                                        onChange={(e) =>
                                            setData(
                                                'admin_name',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.admin_name}
                                    />
                                </Field>
                                <Field
                                    label="Email"
                                    id="email"
                                    error={errors.email}
                                >
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        error={errors.email}
                                    />
                                </Field>
                                <Field
                                    label="Password"
                                    id="password"
                                    error={errors.password}
                                >
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        error={errors.password}
                                    />
                                </Field>
                                <Field
                                    label="Confirm Password"
                                    id="password_confirmation"
                                >
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Panel Branding</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Field label="Panel Name" id="panel_name">
                                    <Input
                                        id="panel_name"
                                        value={data.panel_name}
                                        onChange={(e) =>
                                            setData(
                                                'panel_name',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.panel_name}
                                    />
                                </Field>
                                <Field label="Company" id="company_name">
                                    <Input
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                'company_name',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.company_name}
                                    />
                                </Field>
                                <Field label="Website" id="website">
                                    <Input
                                        id="website"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData('website', e.target.value)
                                        }
                                        error={errors.website}
                                    />
                                </Field>
                                <Field label="GitHub URL" id="github_url">
                                    <Input
                                        id="github_url"
                                        value={data.github_url}
                                        onChange={(e) =>
                                            setData(
                                                'github_url',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.github_url}
                                    />
                                </Field>
                                <Field label="Support Email" id="support_email">
                                    <Input
                                        id="support_email"
                                        value={data.support_email}
                                        onChange={(e) =>
                                            setData(
                                                'support_email',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.support_email}
                                    />
                                </Field>
                                <Field label="Timezone" id="timezone">
                                    <Select
                                        id="timezone"
                                        value={data.timezone}
                                        onChange={(e) =>
                                            setData('timezone', e.target.value)
                                        }
                                    >
                                        {timezones.map((tz) => (
                                            <option key={tz} value={tz}>
                                                {tz}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                            </CardContent>
                        </Card>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={processing}
                            className="w-full"
                        >
                            Finish Setup
                        </Button>
                    </form>
                </div>
                <PanelFooter />
            </div>
        </>
    );
}

function Field({
    label,
    id,
    children,
    error,
}: {
    label: string;
    id: string;
    children: ReactNode;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}
