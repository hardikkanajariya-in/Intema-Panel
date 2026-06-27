import type { ClientFormData, ClientStatus } from '@/types/client';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface ClientFormProps {
    data: ClientFormData;
    errors: Partial<Record<keyof ClientFormData, string>>;
    statuses: ClientStatus[];
    onChange: (field: keyof ClientFormData, value: string) => void;
    isEditing?: boolean;
}

export function ClientForm({ data, errors, statuses, onChange, isEditing = false }: ClientFormProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>Basic details about the hosted project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="company_name" required>
                            Company Name
                        </Label>
                        <Input
                            id="company_name"
                            value={data.company_name}
                            onChange={(event) => {
                                onChange('company_name', event.target.value);
                            }}
                            error={errors.company_name}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="domain" required>
                            Domain
                        </Label>
                        <Input
                            id="domain"
                            value={data.domain}
                            placeholder="example.com"
                            onChange={(event) => {
                                onChange('domain', event.target.value);
                            }}
                            error={errors.domain}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" required>
                            Status
                        </Label>
                        <Select
                            id="status"
                            value={data.status}
                            onChange={(event) => {
                                onChange('status', event.target.value);
                            }}
                            error={errors.status}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            rows={4}
                            onChange={(event) => {
                                onChange('notes', event.target.value);
                            }}
                            error={errors.notes}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Database Credentials</CardTitle>
                    <CardDescription>
                        PostgreSQL connection details (stored encrypted)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="database_name">Database Name</Label>
                        <Input
                            id="database_name"
                            value={data.database_name}
                            onChange={(event) => {
                                onChange('database_name', event.target.value);
                            }}
                            error={errors.database_name}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="database_user">Database User</Label>
                        <Input
                            id="database_user"
                            value={data.database_user}
                            onChange={(event) => {
                                onChange('database_user', event.target.value);
                            }}
                            error={errors.database_user}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="database_password">
                            Database Password
                            {isEditing ? ' (leave blank to keep current)' : ''}
                        </Label>
                        <Input
                            id="database_password"
                            type="password"
                            value={data.database_password}
                            onChange={(event) => {
                                onChange('database_password', event.target.value);
                            }}
                            error={errors.database_password}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
