import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import AppLayout from '@/layouts/AppLayout';

interface ProjectsCreateProps {
    statuses: string[];
}

export default function ProjectsCreate({ statuses }: ProjectsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        status: 'active',
        notes: '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/projects');
    };

    return (
        <AppLayout>
            <Head title="New Project" />
            <PageHeader title="New Project" description="Create an organizational project" breadcrumbs={[{ title: 'Projects', href: '/projects' }, { title: 'New' }]} />
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                <div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated if empty" /></div>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="status">Status</Label><Select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</Select></div>
                <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} /></div>
                <div className="flex gap-3"><Button type="submit" disabled={processing}>Create Project</Button><Button variant="outline" href="/projects">Cancel</Button></div>
            </form>
        </AppLayout>
    );
}
