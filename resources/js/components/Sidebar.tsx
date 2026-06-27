import { Link, usePage } from '@inertiajs/react';

import { X } from '@/components/Icons';
import { isNavItemActive, mainNavigation, secondaryNavigation } from '@/components/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const { url } = usePage();
    const name = usePage().props.name;

    const renderNavItems = (items: typeof mainNavigation) => {
        return items.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item.href, url);

            return (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent',
                    )}
                >
                    <Icon size={18} />
                    {item.title}
                </Link>
            );
        });
    };

    return (
        <>
            {open ? (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    aria-label="Close sidebar"
                    onClick={onClose}
                />
            ) : null}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-sm font-bold">HK</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">{name}</p>
                            <p className="text-xs text-muted-foreground">Hosting Manager</p>
                        </div>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </Button>
                </div>

                <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
                    <div className="space-y-1">{renderNavItems(mainNavigation)}</div>
                    <div className="space-y-1">{renderNavItems(secondaryNavigation)}</div>
                </nav>

                <div className="border-t border-border p-4">
                    <p className="text-xs text-muted-foreground">Internal infrastructure panel</p>
                </div>
            </aside>
        </>
    );
}
