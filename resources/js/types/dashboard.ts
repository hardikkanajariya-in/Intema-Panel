export interface ActivityLogEntry {
    id: number;
    action: string;
    status: string;
    description: string | null;
    actor: string | null;
    created_at: string | null;
}

export interface DeploymentEntry {
    uuid: string;
    status: string;
    status_label: string;
    branch: string;
    deployed_at: string | null;
    application?: { name: string };
}

export interface DashboardStats {
    projects: number;
    applications: number;
    databases: number;
    domains: number;
    sslCertificates: number;
    expiringCertificates: number;
    uptime: string;
    cpuUsage: string;
    ramUsage: string;
    diskUsage: string;
    postgresqlStatus: string;
    phpVersion: string;
    nginxStatus: string;
    laravelVersion: string;
    latestActivity: ActivityLogEntry[];
    recentDeployments: DeploymentEntry[];
}
