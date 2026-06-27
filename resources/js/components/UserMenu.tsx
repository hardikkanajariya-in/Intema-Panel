import { usePage } from '@inertiajs/react';
import { useState } from 'react';

import { LogOut, User } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function UserMenu() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const user = auth.user;

    return (
        <div className="relative">
            <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                    setOpen((current) => !current);
                }}
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={16} />
                </div>
                <span className="hidden text-sm font-medium sm:inline">
                    {user?.name ?? 'Administrator'}
                </span>
            </Button>

            {open ? (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-40"
                        aria-label="Close menu"
                        onClick={() => {
                            setOpen(false);
                        }}
                    />
                    <div
                        className={cn(
                            'absolute right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-card p-1 shadow-lg',
                        )}
                    >
                        <div className="border-b border-border px-3 py-2">
                            <p className="text-sm font-medium text-foreground">
                                {user?.name ?? 'Administrator'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {user?.email ?? 'admin@localhost'}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
}
