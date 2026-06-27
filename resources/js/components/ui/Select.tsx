import { type SelectHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, children, ...props }, ref) => {
        return (
            <div className="w-full">
                <select
                    ref={ref}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-destructive focus-visible:ring-destructive/40',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}
            </div>
        );
    },
);

Select.displayName = 'Select';
