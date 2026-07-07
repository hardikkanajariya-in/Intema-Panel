import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import AppLayout from '@/layouts/AppLayout';

// Inline Custom Icons
const FolderIcon = ({ size = 18 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-500 dark:text-amber-400"
    >
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
);

const FileIcon = ({ size = 18, ext }: { size?: number; ext?: string }) => {
    let strokeColor = 'text-slate-400';
    if (['php', 'js', 'ts', 'tsx', 'html', 'css', 'json'].includes(ext || '')) {
        strokeColor = 'text-blue-500 dark:text-blue-400';
    } else if (['sh', 'bash', 'yaml', 'yml', 'env'].includes(ext || '')) {
        strokeColor = 'text-emerald-500 dark:text-emerald-400';
    } else if (['log', 'txt'].includes(ext || '')) {
        strokeColor = 'text-rose-500 dark:text-rose-400';
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={strokeColor}
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    );
};

const ParentFolderIcon = ({ size = 18 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
    >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
    </svg>
);

interface FileEntry {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: number;
    size_formatted: string;
    permissions: string;
    owner: string;
    group: string;
    modified: string;
    readable: boolean;
    writable: boolean;
    symlink: boolean;
    extension: string;
}

interface FilesIndexProps {
    path: string;
    entries: FileEntry[];
    error: string | null;
}

export default function FilesIndex({ path, entries, error }: FilesIndexProps) {
    const [pathInput, setPathInput] = useState(path);
    const [newItemName, setNewItemName] = useState('');
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);
    const [showNewFileInput, setShowNewFileInput] = useState(false);

    const handleNavigate = (e: FormEvent) => {
        e.preventDefault();
        if (pathInput.trim()) {
            router.get(`/files?path=${encodeURIComponent(pathInput.trim())}`);
        }
    };

    const handleCreateFolder = (e: FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        router.post('/files/create-directory', {
            path,
            name: newItemName.trim(),
        }, {
            onSuccess: () => {
                setNewItemName('');
                setShowNewFolderInput(false);
            }
        });
    };

    const handleCreateFile = (e: FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        router.post('/files/create-file', {
            path,
            name: newItemName.trim(),
        }, {
            onSuccess: () => {
                setNewItemName('');
                setShowNewFileInput(false);
            }
        });
    };

    const handleDelete = (entry: FileEntry) => {
        if (window.confirm(`Are you sure you want to delete ${entry.name}?`)) {
            router.delete('/files', {
                data: { path: entry.path }
            });
        }
    };

    const handleRename = (entry: FileEntry) => {
        const newName = window.prompt(`Rename ${entry.name} to:`, entry.name);
        if (newName && newName.trim() && newName !== entry.name) {
            router.post('/files/rename', {
                path: entry.path,
                name: newName.trim(),
            });
        }
    };

    // Breadcrumbs building
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
            <Head title="File Explorer" />
            <PageHeader
                title="File Explorer"
                description="Explore, edit, and manage all system files at any directory level."
                breadcrumbs={breadcrumbs}
            />

            <div className="mb-6 space-y-4">
                {/* Navigation and quick actions bar */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <form onSubmit={handleNavigate} className="flex flex-1 gap-2">
                        <Input
                            value={pathInput}
                            onChange={(e) => setPathInput(e.target.value)}
                            placeholder="Navigate to absolute path... (e.g. /etc/nginx)"
                            className="font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary"
                        />
                        <Button type="submit" variant="outline">Go</Button>
                    </form>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.reload()}
                            title="Refresh folder contents"
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowNewFolderInput(true);
                                setShowNewFileInput(false);
                            }}
                        >
                            New Folder
                        </Button>
                        <Button
                            onClick={() => {
                                setShowNewFileInput(true);
                                setShowNewFolderInput(false);
                            }}
                        >
                            New File
                        </Button>
                    </div>
                </div>

                {/* Inline Folder Creation Form */}
                {showNewFolderInput && (
                    <Card className="border-primary/30 bg-primary/5">
                        <CardContent className="flex items-center gap-3 p-4">
                            <FolderIcon />
                            <form onSubmit={handleCreateFolder} className="flex flex-1 gap-2">
                                <Input
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="Enter directory name..."
                                    className="max-w-md focus-visible:ring-1 focus-visible:ring-primary"
                                    autoFocus
                                />
                                <Button type="submit">Create Folder</Button>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setShowNewFolderInput(false)}
                                >
                                    Cancel
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Inline File Creation Form */}
                {showNewFileInput && (
                    <Card className="border-primary/30 bg-primary/5">
                        <CardContent className="flex items-center gap-3 p-4">
                            <FileIcon />
                            <form onSubmit={handleCreateFile} className="flex flex-1 gap-2">
                                <Input
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="Enter file name (e.g. script.sh)..."
                                    className="max-w-md focus-visible:ring-1 focus-visible:ring-primary"
                                    autoFocus
                                />
                                <Button type="submit">Create File</Button>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setShowNewFileInput(false)}
                                >
                                    Cancel
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>

            {error ? (
                <Card className="border-destructive/50 bg-destructive/5 text-destructive">
                    <CardHeader>
                        <CardTitle>Error Loading Directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                        <Button
                            className="mt-4"
                            onClick={() => {
                                setPathInput('/');
                                router.get('/files?path=/');
                            }}
                        >
                            Go to Root /
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="font-mono text-sm text-muted-foreground">
                            Current: {path}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Name</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Modified</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entries.map((entry) => {
                                        const isParentLink = entry.name === '..';
                                        return (
                                            <TableRow
                                                key={entry.path + entry.name}
                                                className="group hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {isParentLink ? (
                                                            <ParentFolderIcon size={18} />
                                                        ) : entry.type === 'directory' ? (
                                                            <FolderIcon size={18} />
                                                        ) : (
                                                            <FileIcon size={18} ext={entry.extension} />
                                                        )}

                                                        {isParentLink ? (
                                                            <Link
                                                                href={`/files?path=${encodeURIComponent(entry.path)}`}
                                                                className="text-primary hover:underline"
                                                            >
                                                                .. (Parent Directory)
                                                            </Link>
                                                        ) : entry.type === 'directory' ? (
                                                            <Link
                                                                href={`/files?path=${encodeURIComponent(entry.path)}`}
                                                                className="text-primary hover:underline"
                                                            >
                                                                {entry.name}
                                                                {entry.symlink && <span className="ml-1.5 text-xs text-muted-foreground">(link)</span>}
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={`/files/show?path=${encodeURIComponent(entry.path)}`}
                                                                className="hover:underline text-foreground"
                                                            >
                                                                {entry.name}
                                                                {entry.symlink && <span className="ml-1.5 text-xs text-muted-foreground">(link)</span>}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {entry.size_formatted}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {entry.permissions || '—'}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {entry.owner ? `${entry.owner}:${entry.group}` : '—'}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {entry.modified || '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {!isParentLink && (
                                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleRename(entry)}
                                                            >
                                                                Rename
                                                            </Button>
                                                            {entry.type === 'file' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        href={`/files/show?path=${encodeURIComponent(entry.path)}&edit=true`}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        href={`/files/download?path=${encodeURIComponent(entry.path)}`}
                                                                    >
                                                                        Download
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDelete(entry)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {entries.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                This directory is empty.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
}
