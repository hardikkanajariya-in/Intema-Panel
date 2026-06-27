export type ClientStatus = 'active' | 'inactive' | 'suspended';

export interface Client {
    id: number;
    company_name: string;
    domain: string;
    database_name: string | null;
    database_user: string | null;
    status: ClientStatus;
    notes: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface ClientFormData {
    company_name: string;
    domain: string;
    database_name: string;
    database_user: string;
    database_password: string;
    status: ClientStatus;
    notes: string;
}
