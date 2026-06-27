import {
    AppWindow,
    Database,
    Folder,
    FolderKanban,
    LayoutDashboard,
    Monitor,
    Plus,
    Server,
    Settings,
    Shield,
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
        title: 'Projects',
        href: '/projects',
        icon: FolderKanban,
        routeName: 'projects.index',
    },
    {
        title: 'Applications',
        href: '/applications',
        icon: AppWindow,
        routeName: 'applications.index',
    },
    {
        title: 'Databases',
        href: '/databases',
        icon: Database,
        routeName: 'databases.index',
    },
    {
        title: 'Domains',
        href: '/domains',
        icon: Server,
        routeName: 'domains.index',
    },
    {
        title: 'SSL',
        href: '/ssl-certificates',
        icon: Shield,
        routeName: 'ssl-certificates.index',
    },
];

export const secondaryNavigation: NavItem[] = [
    {
        title: 'Create Resource',
        href: '/resources/create',
        icon: Plus,
        routeName: 'resources.create',
    },
    {
        title: 'Nginx',
        href: '/nginx',
        icon: Server,
        routeName: 'nginx.index',
    },
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
