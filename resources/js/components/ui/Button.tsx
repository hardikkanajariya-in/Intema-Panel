import { Link } from '@inertiajs/react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    secondary: 'bg-muted text-foreground hover:bg-muted/80',
    outline: 'border border-border bg-card hover:bg-muted',
    ghost: 'hover:bg-muted',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
};

const sizeClasses: Record<ButtonSize, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-9 w-9',
};

const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', type = 'button', href, children, ...props }, ref) => {
        const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

        if (href) {
            return (
                <Link href={href} className={classes}>
                    {children}
                </Link>
            );
        }

        return (
            <button ref={ref} type={type} className={classes} {...props}>
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';
