import { router, usePage } from '@inertiajs/react';

import { Laptop, Moon, Sun } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/Hooks/useTheme';
import type { Appearance } from '@/types/navigation';
import { cn } from '@/lib/utils';

const options: { value: Appearance; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Laptop },
];

export function ThemeSwitch() {
    const { appearance: serverAppearance } = usePage().props;
    const { appearance, setAppearance } = useTheme(serverAppearance);

    const handleChange = (next: Appearance) => {
        setAppearance(next);
        router.post(
            '/appearance',
            { appearance: next },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <div className="flex items-center rounded-lg border border-border bg-card p-1">
            {options.map((option) => {
                const Icon = option.icon;
                const isActive = appearance === option.value;

                return (
                    <Button
                        key={option.value}
                        variant="ghost"
                        size="sm"
                        className={cn(
                            'h-8 px-2.5',
                            isActive && 'bg-muted text-foreground',
                        )}
                        onClick={() => {
                            handleChange(option.value);
                        }}
                        title={option.label}
                    >
                        <Icon size={16} />
                        <span className="sr-only">{option.label}</span>
                    </Button>
                );
            })}
        </div>
    );
}
