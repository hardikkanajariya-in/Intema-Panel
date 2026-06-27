import { usePage } from '@inertiajs/react';

import type { PanelConfig } from '@/types/panel';

export function PanelFooter() {
    const { panel } = usePage().props as { panel: PanelConfig };

    return (
        <footer className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
            <p>
                {panel.name} v{panel.version} · {panel.license} License
            </p>
            <p className="mt-1">
                Built with ❤️ by{' '}
                <a
                    href={panel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary transition-colors hover:text-primary/80"
                >
                    {panel.company}
                </a>
            </p>
        </footer>
    );
}
