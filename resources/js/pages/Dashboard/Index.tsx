import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import {
    AppWindow,
    Cpu,
    Database,
    FolderKanban,
    Globe,
    HardDrive,
    MemoryStick,
    Monitor,
    Server,
    Shield,
} from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';
import type { DashboardStats } from '@/types/dashboard';

interface DashboardPageProps {
    stats: DashboardStats;
}

function statusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
    if (status === 'Running' || status === 'Installed') {
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
                description="Infrastructure overview and server health"
                breadcrumbs={[{ title: 'Dashboard' }]}
                actions={
                    <Button href="/resources/create">Create Resource</Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard title="Projects" value={stats.projects} description="Organizational projects" icon={<FolderKanban size={22} />} />
                <StatCard title="Applications" value={stats.applications} description="Managed applications" icon={<AppWindow size={22} />} />
                <StatCard title="Databases" value={stats.databases} description="PostgreSQL databases" icon={<Database size={22} />} />
                <StatCard title="Domains" value={stats.domains} description="Configured domains" icon={<Globe size={22} />} />
                <StatCard title="SSL Certificates" value={stats.sslCertificates} description="Managed certificates" icon={<Shield size={22} />} />
                <StatCard title="Expiring Certs" value={stats.expiringCertificates} description="Within 30 days" icon={<Shield size={22} />} />
                <StatCard title="Deployments" value={stats.deployments} description="Recorded deployments" icon={<AppWindow size={22} />} />
                <StatCard title="Load Average" value={stats.loadAverage} description="1, 5, 15 minute load" icon={<Cpu size={22} />} />
                <StatCard title="Server Uptime" value={stats.uptime} description="System uptime" icon={<Monitor size={22} />} />
                <StatCard title="CPU Usage" value={stats.cpuUsage} description="Processor utilization" icon={<Cpu size={22} />} />
                <StatCard title="RAM Usage" value={stats.ramUsage} description="Memory utilization" icon={<MemoryStick size={22} />} />
                <StatCard title="Disk Usage" value={stats.diskUsage} description="Root filesystem usage" icon={<HardDrive size={22} />} />
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

                <Card>
                    <CardHeader>
                        <CardTitle>Latest Activity</CardTitle>
                        <CardDescription>Recent infrastructure events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.latestActivity.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No activity yet.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>When</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.latestActivity.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{log.action}</TableCell>
                                            <TableCell className="text-muted-foreground">{log.description}</TableCell>
                                            <TableCell>{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        <div className="mt-4">
                            <Button variant="outline" href="/activity-logs">View All Activity</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Deployment History</CardTitle>
                        <CardDescription>Recent application deployments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.recentDeployments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No deployments yet.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Application</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.recentDeployments.map((deployment) => (
                                        <TableRow key={deployment.uuid}>
                                            <TableCell>{deployment.application?.name ?? '—'}</TableCell>
                                            <TableCell>{deployment.branch}</TableCell>
                                            <TableCell>
                                                <Badge variant={deployment.status === 'active' ? 'success' : 'secondary'}>
                                                    {deployment.status_label}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function StatusRow({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
            <Badge variant={statusVariant(value)}>{value}</Badge>
        </div>
    );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
            <span className="text-sm font-medium text-foreground">{value}</span>
        </div>
    );
}
