import { Head, Link } from '@inertiajs/react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';

interface FileEntry {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: string;
}

interface FilesIndexProps {
    path: string;
    entries: FileEntry[];
}

export default function FilesIndex({ path, entries }: FilesIndexProps) {
    const parent = path.includes('/')
        ? path.split('/').slice(0, -1).join('/')
        : '';

    return (
        <AppLayout>
            <Head title="File Manager" />
            <PageHeader
                title="File Manager"
                description="Browse project files and logs"
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Files' },
                ]}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="font-mono text-sm">
                        {path || '/'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {parent ? (
                        <div className="border-b border-border px-4 py-2">
                            <Link
                                href={`/files?path=${parent}`}
                                className="text-sm text-primary"
                            >
                                ..
                            </Link>
                        </div>
                    ) : null}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map((entry) => (
                                <TableRow key={entry.path}>
                                    <TableCell>
                                        {entry.type === 'directory' ? (
                                            <Link
                                                href={`/files?path=${entry.path}`}
                                                className="font-medium text-primary"
                                            >
                                                {entry.name}
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/files/show/${entry.path}`}
                                                className="font-medium"
                                            >
                                                {entry.name}
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell>{entry.type}</TableCell>
                                    <TableCell>{entry.size || '—'}</TableCell>
                                    <TableCell className="text-right">
                                        {entry.type === 'file' ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                href={`/files/download/${entry.path}`}
                                            >
                                                Download
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
