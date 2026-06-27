import { Head } from '@inertiajs/react';

import { Cpu, Database, Globe, HardDrive, MemoryStick, Users } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import type { DashboardStats } from '@/types/dashboard';

interface DashboardPageProps {
    stats: DashboardStats;
}

export default function DashboardIndex({ stats }: DashboardPageProps) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <PageHeader
                title="Dashboard"
                description="Overview of your hosting infrastructure"
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
                    description="PostgreSQL databases"
                    icon={<Database size={22} />}
                />
                <StatCard
                    title="Domains"
                    value={stats.domains}
                    description="Configured domains"
                    icon={<Globe size={22} />}
                />
                <StatCard
                    title="CPU Usage"
                    value={stats.cpuUsage}
                    description="Server processor load"
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
                    description="Storage utilization"
                    icon={<HardDrive size={22} />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to HK Hosting Manager</CardTitle>
                        <CardDescription>
                            Your internal infrastructure management panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This panel helps you manage clients, databases, Nginx configurations,
                            SSL certificates, and Cloudflare settings for your VPS hosting
                            environment. System metrics will be available in a future release.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common management tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Add and manage client projects</li>
                            <li>• Configure database credentials</li>
                            <li>• Manage Nginx virtual hosts</li>
                            <li>• Monitor SSL certificate status</li>
                            <li>• Configure Cloudflare DNS settings</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
