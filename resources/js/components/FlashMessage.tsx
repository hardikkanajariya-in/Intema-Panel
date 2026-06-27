import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { X } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }
    }, [flash.success, flash.error]);

    useEffect(() => {
        if (!visible) {
            return;
        }

        const timer = window.setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => {
            window.clearTimeout(timer);
        };
    }, [visible, message]);

    if (!visible || !message) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed right-4 top-4 z-50 flex max-w-md items-start gap-3 rounded-lg border px-4 py-3 shadow-lg',
                type === 'success'
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-destructive/30 bg-destructive/10 text-destructive',
            )}
        >
            <p className="flex-1 text-sm font-medium">{message}</p>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => {
                    setVisible(false);
                }}
            >
                <X size={14} />
            </Button>
        </div>
    );
}
