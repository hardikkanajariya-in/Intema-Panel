import { Head, router } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';

interface DatabaseEntry {
    id: number;
    company_name: string;
    domain: string;
    database_name: string;
    database_user: string;
    exists: boolean;
    connection_string: string;
}

interface DatabasesIndexProps {
    databases: DatabaseEntry[];
    adminerUrl: string;
    postgresqlStatus: string;
}

export default function DatabasesIndex({ databases, adminerUrl, postgresqlStatus }: DatabasesIndexProps) {
    return (
        <AppLayout>
            <Head title="Databases" />

            <PageHeader
                title="PostgreSQL Databases"
                description="Manage client databases provisioned by the panel"
                breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Databases' }]}
                actions={<Button href={adminerUrl} variant="outline">Open Adminer</Button>}
            />

            <Card className="mb-6">
                <CardHeader><CardTitle>PostgreSQL Status</CardTitle></CardHeader>
                <CardContent><Badge variant={postgresqlStatus === 'Running' ? 'success' : 'destructive'}>{postgresqlStatus}</Badge></CardContent>
            </Card>

            <div className="rounded-xl border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Database</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {databases.map((db) => (
                            <TableRow key={db.id}>
                                <TableCell>
                                    <div className="font-medium">{db.company_name}</div>
                                    <div className="text-xs text-muted-foreground">{db.domain}</div>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{db.database_name}</TableCell>
                                <TableCell className="font-mono text-xs">{db.database_user}</TableCell>
                                <TableCell><Badge variant={db.exists ? 'success' : 'destructive'}>{db.exists ? 'Exists' : 'Missing'}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button size="sm" variant="outline" onClick={() => router.post(`/databases/${db.id}/backup`)}>Backup</Button>
                                        <Button size="sm" variant="outline" onClick={() => router.post(`/databases/${db.id}/reset-password`)}>Reset Password</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
