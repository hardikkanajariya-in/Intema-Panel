import { Head, useForm, usePage } from '@inertiajs/react';
import type {FormEvent} from 'react';

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
import type { PanelConfig } from '@/types/panel';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login() {
    const { panel } = usePage().props as { panel: PanelConfig };
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen flex-col bg-background">
                <div className="flex flex-1 items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <span className="text-lg font-bold">IP</span>
                            </div>
                            <CardTitle>{panel.name}</CardTitle>
                            <CardDescription>{panel.tagline}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" required>
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(event) => {
                                            setData(
                                                'email',
                                                event.target.value,
                                            );
                                        }}
                                        error={errors.email}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" required>
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(event) => {
                                            setData(
                                                'password',
                                                event.target.value,
                                            );
                                        }}
                                        error={errors.password}
                                    />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(event) => {
                                            setData(
                                                'remember',
                                                event.target.checked,
                                            );
                                        }}
                                        className="rounded border-border"
                                    />
                                    Remember me
                                </label>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Sign in
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <PanelFooter />
            </div>
        </>
    );
}
