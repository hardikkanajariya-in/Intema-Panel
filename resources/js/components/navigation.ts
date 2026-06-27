import {
    Cloud,
    Database,
    Folder,
    LayoutDashboard,
    Monitor,
    Server,
    Settings,
    Shield,
    Users,
} from '@/components/Icons';
import type { NavItem } from '@/types/navigation';

export const mainNavigation: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        routeName: 'dashboard',
    },
    {
        title: 'Clients',
        href: '/clients',
        icon: Users,
        routeName: 'clients.index',
    },
    {
        title: 'Databases',
        href: '/databases',
        icon: Database,
        routeName: 'databases.index',
    },
    {
        title: 'Nginx',
        href: '/nginx',
        icon: Server,
        routeName: 'nginx.index',
    },
    {
        title: 'SSL',
        href: '/ssl',
        icon: Shield,
        routeName: 'ssl.index',
    },
    {
        title: 'Cloudflare',
        href: '/cloudflare',
        icon: Cloud,
        routeName: 'cloudflare.index',
    },
];

export const secondaryNavigation: NavItem[] = [
    {
        title: 'System',
        href: '/system',
        icon: Monitor,
        routeName: 'system.index',
    },
    {
        title: 'Files',
        href: '/files',
        icon: Folder,
        routeName: 'files.index',
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        routeName: 'settings.index',
    },
];

export function isNavItemActive(href: string, currentUrl: string): boolean {
    if (href === '/dashboard') {
        return currentUrl === '/dashboard' || currentUrl === '/';
    }

    return currentUrl.startsWith(href);
}
