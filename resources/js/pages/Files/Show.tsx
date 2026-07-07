import { Head, useForm } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import AppLayout from '@/layouts/AppLayout';

interface FilesShowProps {
    path: string;
    contents: string;
    editable: boolean;
    error: string | null;
}

export default function FilesShow({
    path,
    contents,
    editable,
    error,
}: FilesShowProps) {
    const [isEditing, setIsEditing] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('edit') === 'true';
        }
        return false;
    });

    const { data, setData, put, processing } = useForm({
        path,
        contents,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put('/files', {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const pathParts = path.split('/').filter(Boolean);
    const breadcrumbs = [
        { title: 'Files', href: '/files?path=/' },
        ...pathParts.map((part, index) => {
            const currentPath = '/' + pathParts.slice(0, index + 1).join('/');
            const isLast = index === pathParts.length - 1;
            return {
                title: part,
                href: isLast ? undefined : `/files?path=${encodeURIComponent(currentPath)}`,
            };
        }),
    ];

    return (
        <AppLayout>
            <Head title={path} />
            <PageHeader
                title={pathParts[pathParts.length - 1] || 'File'}
                breadcrumbs={breadcrumbs}
                actions={
                    !error && (
                        <div className="flex gap-2">
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                href={`/files/download?path=${encodeURIComponent(path)}`}
                            >
                                Download
                            </Button>
                        </div>
                    )
                }
            />

            {error ? (
                <Card className="border-destructive/50 bg-destructive/5 text-destructive">
                    <CardHeader>
                        <CardTitle>Error Loading File</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                        <Button
                            className="mt-4"
                            href={`/files?path=${encodeURIComponent(
                                path.substring(0, path.lastIndexOf('/')) || '/',
                            )}`}
                        >
                            Back to Folder
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEditing ? 'Edit File' : 'View File'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <form onSubmit={submit} className="space-y-4">
                                <Textarea
                                    rows={25}
                                    value={data.contents}
                                    onChange={(e) =>
                                        setData('contents', e.target.value)
                                    }
                                    className="font-mono text-xs focus-visible:ring-1 focus-visible:ring-primary"
                                />
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save File'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <pre className="max-h-[70vh] overflow-auto rounded-lg bg-muted p-4 text-xs font-mono">
                                    {contents}
                                </pre>
                                <Button
                                    variant="outline"
                                    href={`/files?path=${encodeURIComponent(
                                        path.substring(0, path.lastIndexOf('/')) || '/',
                                    )}`}
                                >
                                    Back to Folder
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
}
