import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';
import type { ManagedDatabase } from '@/types/resource';

interface DatabaseBackupLog {
    uuid: string;
    filename: string;
    size: number;
    created_at: string;
}

interface DatabasesRestoreProps {
    database: ManagedDatabase;
    backups: DatabaseBackupLog[];
}

export default function DatabasesRestore({ database, backups }: DatabasesRestoreProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        backup_file: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.backup_file) {
            return;
        }

        if (confirm('Warning: Restoring will overwrite the current database tables and data. Are you sure you want to proceed?')) {
            post(`/databases/${database.uuid}/restore`, {
                onSuccess: () => reset(),
            });
        }
    };

    const handleRestoreFromLog = (backupUuid: string) => {
        if (confirm('Warning: Restoring will overwrite the current database tables and data. Are you sure you want to proceed?')) {
            router.post(`/databases/${database.uuid}/backups/${backupUuid}/restore`);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AppLayout>
            <Head title={`Restore - ${database.name}`} />
            <PageHeader
                title={`Restore Database: ${database.name}`}
                breadcrumbs={[
                    { title: 'Databases', href: '/databases' },
                    { title: database.name, href: `/databases/${database.uuid}` },
                    { title: 'Restore' },
                ]}
            />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload SQL Backup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                            <div className="space-y-2">
                                <Label htmlFor="backup_file">SQL File (.sql or .sql.gz)</Label>
                                <Input
                                    id="backup_file"
                                    type="file"
                                    accept=".sql,.sql.gz"
                                    onChange={(e) => setData('backup_file', e.target.files?.[0] || null)}
                                    disabled={processing}
                                />
                                {errors.backup_file && (
                                    <p className="text-sm text-destructive">{errors.backup_file}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={!data.backup_file || processing}>
                                {processing ? 'Restoring...' : 'Upload & Restore'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Backup History Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {backups.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No backups recorded for this database yet.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>File Name</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {backups.map((backup) => (
                                        <TableRow key={backup.uuid}>
                                            <TableCell>
                                                {new Date(backup.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{backup.filename}</TableCell>
                                            <TableCell>{formatSize(backup.size)}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        window.location.href = `/databases/${database.uuid}/backups/${backup.uuid}/download`;
                                                    }}
                                                >
                                                    Download
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleRestoreFromLog(backup.uuid)}
                                                >
                                                    Restore
                                                </Button>
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
