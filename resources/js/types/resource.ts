export interface Project {
    uuid: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    status_label: string;
    notes: string | null;
    applications_count?: number;
    databases_count?: number;
    domains_count?: number;
    created_at: string | null;
}

export interface Application {
    uuid: string;
    name: string;
    type: string;
    type_label: string;
    status: string;
    status_label: string;
    project_id: number | null;
    root_path: string | null;
    repository_url: string | null;
    repository_branch: string;
    deploy_path: string | null;
    runtime: string | null;
    linux_user: string | null;
    webhook_url?: string;
    webhook_secret?: string;
    notes: string | null;
    created_at: string | null;
}

export interface ManagedDatabase {
    uuid: string;
    name: string;
    database_name: string;
    database_user: string;
    database_password?: string;
    host: string;
    port: number;
    status: string;
    status_label: string;
    project_id: number | null;
    application_id: number | null;
    notes: string | null;
    created_at: string | null;
}

export interface Domain {
    uuid: string;
    hostname: string;
    nginx_site: string | null;
    document_root: string | null;
    ssl_active: boolean;
    status: string;
    status_label: string;
    project_id: number | null;
    application_id: number | null;
    notes: string | null;
    created_at: string | null;
}

export interface SslCertificate {
    uuid: string;
    domain_name: string;
    issuer: string | null;
    expires_at: string | null;
    auto_renew: boolean;
    status: string;
    status_label: string;
    created_at: string | null;
}

export interface ApplicationTypeOption {
    value: string;
    label: string;
}
