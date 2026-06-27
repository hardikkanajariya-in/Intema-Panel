import { Head, useForm } from '@inertiajs/react';
import type {FormEvent} from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import AppLayout from '@/layouts/AppLayout';

interface FilesShowProps {
    path: string;
    contents: string;
    editable: boolean;
}

export default function FilesShow({
    path,
    contents,
    editable,
}: FilesShowProps) {
    const { data, setData, put, processing } = useForm({ contents });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(`/files/${path}`);
    };

    return (
        <AppLayout>
            <Head title={path} />
            <PageHeader
                title={path}
                breadcrumbs={[
                    { title: 'Files', href: '/files' },
                    { title: path },
                ]}
                actions={
                    <Button variant="outline" href={`/files/download/${path}`}>
                        Download
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {editable ? 'Edit File' : 'View File'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {editable ? (
                        <form onSubmit={submit} className="space-y-4">
                            <Textarea
                                rows={20}
                                value={data.contents}
                                onChange={(e) =>
                                    setData('contents', e.target.value)
                                }
                                className="font-mono text-xs"
                            />
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                        </form>
                    ) : (
                        <pre className="max-h-[70vh] overflow-auto rounded-lg bg-muted p-4 text-xs">
                            {contents}
                        </pre>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
