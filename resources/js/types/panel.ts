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
    support_email: string;
    timezone: string;
    theme?: string;
    github_token?: string;
    cloudflare_token?: string;
    default_database_prefix: string;
    default_resource_status?: string;
}
