import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type { ManagedDatabase } from '@/types/resource';

interface DatabasesShowProps {
    database: ManagedDatabase;
}

export default function DatabasesShow({ database }: DatabasesShowProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AppLayout>
            <Head title={database.name} />
            <PageHeader
                title={database.name}
                breadcrumbs={[
                    { title: 'Databases', href: '/databases' },
                    { title: database.name },
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                window.location.href = `/databases/${database.uuid}/backup`;
                            }}
                        >
                            Backup
                        </Button>
                        <Button
                            variant="outline"
                            href={`/databases/${database.uuid}/restore`}
                        >
                            Restore
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.post(
                                    `/databases/${database.uuid}/reset-password`,
                                )
                            }
                        >
                            Reset Password
                        </Button>
                    </div>
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Connection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div>
                        <span className="text-muted-foreground">Database:</span>{' '}
                        <code>{database.database_name}</code>
                    </div>
                    <div>
                        <span className="text-muted-foreground">User:</span>{' '}
                        <code>{database.database_user}</code>
                    </div>
                    {database.database_password && (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Password:</span>{' '}
                            <code className="font-mono">
                                {showPassword ? database.database_password : '••••••••••••'}
                            </code>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </Button>
                        </div>
                    )}
                    <div>
                        <span className="text-muted-foreground">Host:</span>{' '}
                        {database.host}:{database.port}
                    </div>
                    <div>
                        <span className="text-muted-foreground">Status:</span>{' '}
                        <Badge variant="success">{database.status_label}</Badge>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
