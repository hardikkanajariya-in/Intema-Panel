import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    StatCard,
} from '@/components/ui/Card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';

interface ComponentStatus {
    name: string;
    label: string;
    installed: boolean;
    version: string | null;
    status: string;
    service: string | null;
}

interface MonitoringSnapshot {
    cpu: string;
    ram: string;
    disk: string;
    loadAverage: string;
    uptime: string;
    processes: number;
    php: { version: string; status: string };
    nginx: { version: string; status: string };
    postgresql: { version: string; status: string };
    laravel: string;
}

interface SystemIndexProps {
    monitoring: MonitoringSnapshot;
    components: ComponentStatus[];
}

export default function SystemIndex({
    monitoring,
    components,
}: SystemIndexProps) {
    const [updating, setUpdating] = useState(false);

    const runAction = (component: string, action: string) => {
        router.post('/system/action', { component, action });
    };

    const runUpdate = () => {
        if (window.confirm('Are you sure you want to update the Intema Panel? This will download/pull the latest code in the background.')) {
            setUpdating(true);
            router.post('/system/update', {}, {
                onFinish: () => setUpdating(false)
            });
        }
    };

    return (
        <AppLayout>
            <Head title="System" />
            <PageHeader
                title="System"
                description="Monitoring and service management"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'System' },
                ]}
                actions={
                    <Button onClick={runUpdate} disabled={updating}>
                        {updating ? 'Updating...' : 'Update Panel'}
                    </Button>
                }
            />
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="CPU"
                    value={monitoring.cpu}
                    icon={<span>CPU</span>}
                />
                <StatCard
                    title="RAM"
                    value={monitoring.ram}
                    icon={<span>RAM</span>}
                />
                <StatCard
                    title="Disk"
                    value={monitoring.disk}
                    icon={<span>Disk</span>}
                />
                <StatCard
                    title="Uptime"
                    value={monitoring.uptime}
                    icon={<span>Up</span>}
                />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Runtime</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <Row
                            label="Load Average"
                            value={monitoring.loadAverage}
                        />
                        <Row
                            label="Processes"
                            value={String(monitoring.processes)}
                        />
                        <Row
                            label="PHP"
                            value={`${monitoring.php.version} (${monitoring.php.status})`}
                        />
                        <Row
                            label="Nginx"
                            value={`${monitoring.nginx.version} (${monitoring.nginx.status})`}
                        />
                        <Row
                            label="PostgreSQL"
                            value={`${monitoring.postgresql.version} (${monitoring.postgresql.status})`}
                        />
                        <Row label="Laravel" value={monitoring.laravel} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>System Components</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Component</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {components.map((component) => (
                                    <TableRow key={component.name}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {component.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {component.version ??
                                                    'Not installed'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    component.installed
                                                        ? 'success'
                                                        : 'secondary'
                                                }
                                            >
                                                {component.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-wrap justify-end gap-1">
                                                {!component.installed && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            runAction(
                                                                component.name,
                                                                'install',
                                                            )
                                                        }
                                                    >
                                                        Install
                                                    </Button>
                                                )}
                                                {component.installed && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            runAction(
                                                                component.name,
                                                                'update',
                                                            )
                                                        }
                                                    >
                                                        Update
                                                    </Button>
                                                )}
                                                {component.installed && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            runAction(
                                                                component.name,
                                                                'validate',
                                                            )
                                                        }
                                                    >
                                                        Validate
                                                    </Button>
                                                )}
                                                {component.installed && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            runAction(
                                                                component.name,
                                                                'repair',
                                                            )
                                                        }
                                                    >
                                                        Repair
                                                    </Button>
                                                )}
                                                {component.service && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            runAction(
                                                                component.name,
                                                                'restart',
                                                            )
                                                        }
                                                    >
                                                        Restart
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-border py-2 last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
