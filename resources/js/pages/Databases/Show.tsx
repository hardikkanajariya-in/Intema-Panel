import { Head, router } from '@inertiajs/react';

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
                            onClick={() =>
                                router.post(
                                    `/databases/${database.uuid}/backup`,
                                )
                            }
                        >
                            Backup
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
