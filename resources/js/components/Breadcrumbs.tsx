import { Link } from '@inertiajs/react';

import { ChevronRight } from '@/components/Icons';
import type { BreadcrumbItem } from '@/types/navigation';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={`${item.title}-${index}`} className="flex items-center gap-1">
                        {index > 0 ? (
                            <ChevronRight size={14} className="text-muted-foreground" />
                        ) : null}
                        {isLast || !item.href ? (
                            <span className="font-medium text-foreground">{item.title}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {item.title}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
