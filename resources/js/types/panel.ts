export interface PanelConfig {
    name: string;
    tagline: string;
    company: string;
    website: string;
    github: string;
    support_email: string;
    version: string;
    license: string;
}

export interface PanelSettings {
    panel_name: string;
    company_name: string;
    website: string;
    support_email: string;
    timezone: string;
    theme: string;
    github_url: string;
    default_database_prefix: string;
    default_client_status: string;
}

export interface ActivityLogEntry {
    id: number;
    action: string;
    status: string;
    description: string;
    actor: string | null;
    properties: Record<string, unknown> | null;
    created_at: string | null;
}
