import type { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            {icon ? <div className="mb-4 text-muted-foreground">{icon}</div> : null}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}
