import { Menu } from '@/components/Icons';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu size={20} />
                </Button>
                <p className="hidden text-sm text-muted-foreground sm:block">
                    Manage your VPS infrastructure
                </p>
            </div>

            <div className="flex items-center gap-3">
                <ThemeSwitch />
                <UserMenu />
            </div>
        </header>
    );
}
