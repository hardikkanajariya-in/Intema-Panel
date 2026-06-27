import { useCallback, useEffect, useState } from 'react';

import type { Appearance } from '@/types/navigation';

function resolveTheme(appearance: Appearance): 'light' | 'dark' {
    if (appearance === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    return appearance;
}

function applyTheme(appearance: Appearance): void {
    const resolved = resolveTheme(appearance);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function useTheme(initialAppearance: Appearance = 'system') {
    const [appearance, setAppearance] = useState<Appearance>(initialAppearance);

    useEffect(() => {
        applyTheme(appearance);
    }, [appearance]);

    useEffect(() => {
        if (appearance !== 'system') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            applyTheme('system');
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [appearance]);

    const updateAppearance = useCallback((next: Appearance) => {
        setAppearance(next);
        applyTheme(next);
    }, []);

    return {
        appearance,
        setAppearance: updateAppearance,
        resolvedTheme: resolveTheme(appearance),
    };
}
