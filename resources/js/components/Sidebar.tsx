import { Link, usePage } from '@inertiajs/react';

import { Activity, X } from '@/components/Icons';
import {
    isNavItemActive,
    mainNavigation,
    secondaryNavigation,
} from '@/components/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { PanelConfig } from '@/types/panel';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const { panel } = usePage().props as unknown as { panel: PanelConfig };
    const { url } = usePage();

    const activityNav = {
        title: 'Activity Logs',
        href: '/activity-logs',
        icon: Activity,
        routeName: 'activity-logs.index',
    };

    const bottomNavigation = [...secondaryNavigation, activityNav];

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
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2"
                        onClick={onClose}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-sm font-bold">IP</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">
                                {panel.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {panel.tagline}
                            </p>
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
                    <div className="space-y-1">
                        {renderNavItems(mainNavigation)}
                    </div>
                    <div className="space-y-1">
                        {renderNavItems(bottomNavigation)}
                    </div>
                </nav>

                <div className="border-t border-border p-4 text-center text-xs text-muted-foreground bg-sidebar">
                    <p className="font-semibold">
                        {panel.name} v{panel.version}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                        {panel.license} License
                    </p>
                    <p className="mt-1.5 text-[10px] leading-relaxed">
                        Built with ❤️ by{' '}
                        <a
                            href="https://github.com/hardikkanajariya-in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline"
                        >
                            Hardik Kanajariya
                        </a>
                        <br />
                        <span className="text-[9px] text-muted-foreground">
                            (<a
                                href="https://github.com/hardik-kanajariya"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-muted-foreground"
                            >
                                @hardik-kanajariya
                            </a>)
                        </span>
                    </p>
                </div>
            </aside>
        </>
    );
}
