import { usePage } from '@inertiajs/react';

import { PanelFooter } from '@/components/PanelFooter';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { UserMenu } from '@/components/UserMenu';
import { Menu } from '@/components/Icons';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu size={20} />
                </Button>
                <p className="hidden text-sm text-muted-foreground sm:block">
                    Open Source Lightweight Hosting Control Panel
                </p>
            </div>

            <div className="flex items-center gap-3">
                <ThemeSwitch />
                {user ? (
                    <UserMenu userName={user.name} userEmail={user.email} />
                ) : null}
            </div>
        </header>
    );
}
