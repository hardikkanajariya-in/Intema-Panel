import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex flex-col gap-1.5 p-6 pb-0', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn('text-lg font-semibold leading-none', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('p-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: ReactNode;
    trend?: string;
}

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {description ? (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        ) : null}
                        {trend ? <p className="text-xs text-muted-foreground">{trend}</p> : null}
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
                </div>
            </CardContent>
        </Card>
    );
}
