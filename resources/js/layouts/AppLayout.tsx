import { usePage } from '@inertiajs/react';
import {  useEffect, useState } from 'react';
import type {ReactNode} from 'react';

import { FlashMessage } from '@/components/FlashMessage';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useIsMobile } from '@/Hooks/useMobile';
import { useTheme } from '@/Hooks/useTheme';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { appearance } = usePage().props;
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useTheme(appearance);

    useEffect(() => {
        if (!isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar
                open={sidebarOpen}
                onClose={() => {
                    setSidebarOpen(false);
                }}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header
                    onMenuClick={() => {
                        setSidebarOpen(true);
                    }}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>

            <FlashMessage />
        </div>
    );
}
