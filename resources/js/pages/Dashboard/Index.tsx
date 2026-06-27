import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import {
    Cpu,
    Database,
    HardDrive,
    MemoryStick,
    Monitor,
    Server,
    Shield,
    Users,
} from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type { DashboardStats } from '@/types/dashboard';

interface DashboardPageProps {
    stats: DashboardStats;
}

function statusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
    if (status === 'Running') {
        return 'success';
    }

    if (status === 'N/A' || status === 'Unavailable') {
        return 'secondary';
    }

    return 'destructive';
}

export default function DashboardIndex({ stats }: DashboardPageProps) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <PageHeader
                title="Dashboard"
                description="Infrastructure overview and system health"
                breadcrumbs={[{ title: 'Dashboard' }]}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    title="Clients"
                    value={stats.clients}
                    description="Total managed clients"
                    icon={<Users size={22} />}
                />
                <StatCard
                    title="Databases"
                    value={stats.databases}
                    description="Provisioned PostgreSQL databases"
                    icon={<Database size={22} />}
                />
                <StatCard
                    title="Server Uptime"
                    value={stats.uptime}
                    description="System uptime"
                    icon={<Monitor size={22} />}
                />
                <StatCard
                    title="CPU Usage"
                    value={stats.cpuUsage}
                    description="Processor utilization"
                    icon={<Cpu size={22} />}
                />
                <StatCard
                    title="RAM Usage"
                    value={stats.ramUsage}
                    description="Memory utilization"
                    icon={<MemoryStick size={22} />}
                />
                <StatCard
                    title="Disk Usage"
                    value={stats.diskUsage}
                    description="Root filesystem usage"
                    icon={<HardDrive size={22} />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Service Status</CardTitle>
                        <CardDescription>Core infrastructure services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <StatusRow label="PostgreSQL" value={stats.postgresqlStatus} icon={<Database size={16} />} />
                        <StatusRow label="Nginx" value={stats.nginxStatus} icon={<Server size={16} />} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Runtime Information</CardTitle>
                        <CardDescription>Application and server versions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <InfoRow label="PHP Version" value={stats.phpVersion} icon={<Shield size={16} />} />
                        <InfoRow label="Laravel Version" value={stats.laravelVersion} icon={<Server size={16} />} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function StatusRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </div>
            <Badge variant={statusVariant(value)}>{value}</Badge>
        </div>
    );
}

function InfoRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </div>
            <span className="text-sm font-medium text-foreground">{value}</span>
        </div>
    );
}
