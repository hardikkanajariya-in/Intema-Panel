import type { LucideIcon } from '@/components/Icons';

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    routeName: string;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export type Appearance = 'light' | 'dark' | 'system';
