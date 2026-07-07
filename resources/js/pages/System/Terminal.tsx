import { Head } from '@inertiajs/react';
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';

interface TerminalLine {
    type: 'prompt' | 'stdout' | 'stderr' | 'system';
    text: string;
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
        return null;
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    }
    return null;
}

export default function Terminal() {
    const [lines, setLines] = useState<TerminalLine[]>([
        { type: 'system', text: 'Welcome to the Intema Panel Terminal.' },
        { type: 'system', text: 'Type any shell command below. Use Ctrl+C to abort running processes.' },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Auto-scroll to the bottom of terminal output
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    // Keep focus on input
    const focusInput = () => {
        if (!isRunning) {
            inputRef.current?.focus();
        }
    };

    useEffect(() => {
        focusInput();
    }, [isRunning]);

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const command = inputValue.trim();
        if (!command) {
            return;
        }

        // Add to history
        const newHistory = [command, ...commandHistory.filter((h) => h !== command)].slice(0, 50);
        setCommandHistory(newHistory);
        setHistoryIndex(-1);
        setInputValue('');

        executeCommand(command);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Ctrl+C handling
        if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault();
            abortCurrentCommand();
            return;
        }

        // Up Arrow: History backward
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length === 0) {
                return;
            }

            const nextIndex = historyIndex + 1;
            if (nextIndex < commandHistory.length) {
                setHistoryIndex(nextIndex);
                setInputValue(commandHistory[nextIndex]);
            }
        }

        // Down Arrow: History forward
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = historyIndex - 1;
            if (nextIndex >= 0) {
                setHistoryIndex(nextIndex);
                setInputValue(commandHistory[nextIndex]);
            } else {
                setHistoryIndex(-1);
                setInputValue('');
            }
        }
    };

    const abortCurrentCommand = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const clearTerminal = () => {
        setLines([
            { type: 'system', text: 'Terminal cleared.' },
        ]);
        focusInput();
    };

    const executeCommand = async (command: string) => {
        if (command.toLowerCase() === 'clear') {
            clearTerminal();
            return;
        }

        // Output command prompt line
        setLines((prev) => [...prev, { type: 'prompt', text: `admin@intema-panel:~$ ${command}` }]);
        setIsRunning(true);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const response = await fetch('/system/terminal/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
                },
                body: JSON.stringify({ command }),
                signal: abortController.signal,
            });

            if (!response.body) {
                throw new Error('ReadableStream not supported by this browser.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let partialBuffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                const parts = (partialBuffer + chunk).split('\n');
                partialBuffer = parts.pop() || '';

                for (const part of parts) {
                    if (part.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(part.substring(6));
                            if (data.type === 'stdout' || data.type === 'stderr') {
                                setLines((prev) => [...prev, { type: data.type, text: data.output }]);
                            } else if (data.type === 'exit') {
                                setLines((prev) => [
                                    ...prev,
                                    { type: 'system', text: `Process exited with code ${data.code}` },
                                ]);
                            }
                        } catch (err) {
                            // Suppress JSON parsing errors for partial lines
                        }
                    }
                }
            }

            // Flush remaining buffer
            if (partialBuffer.startsWith('data: ')) {
                try {
                    const data = JSON.parse(partialBuffer.substring(6));
                    if (data.type === 'stdout' || data.type === 'stderr') {
                        setLines((prev) => [...prev, { type: data.type, text: data.output }]);
                    }
                } catch (err) {}
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                setLines((prev) => [...prev, { type: 'system', text: '^C (Command aborted by user)' }]);
            } else {
                setLines((prev) => [...prev, { type: 'stderr', text: `Error: ${error.message}` }]);
            }
        } finally {
            setIsRunning(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <AppLayout>
            <Head title="System Terminal" />
            <PageHeader
                title="System Terminal"
                description="Execute shell commands on the server in real-time."
                breadcrumbs={[
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'System', href: '/system' },
                    { title: 'Terminal' },
                ]}
                actions={
                    <div className="flex gap-2">
                        {isRunning && (
                            <Button
                                variant="destructive"
                                onClick={abortCurrentCommand}
                            >
                                Stop (Ctrl+C)
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={clearTerminal}
                        >
                            Clear Screen
                        </Button>
                    </div>
                }
            />

            <Card className="border-slate-800 bg-slate-950 shadow-2xl">
                {/* Terminal Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
                    <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-rose-500" />
                        <span className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-mono text-slate-400">admin@intema-panel:~</span>
                    <div className="w-12" /> {/* spacer to center title */}
                </div>

                {/* Terminal Window Screen */}
                <CardContent
                    className="h-[60vh] overflow-y-auto p-4 font-mono text-xs cursor-text"
                    onClick={focusInput}
                >
                    <div className="space-y-1.5">
                        {lines.map((line, index) => {
                            if (line.type === 'prompt') {
                                return (
                                    <div key={index} className="text-emerald-400 font-semibold">
                                        {line.text}
                                    </div>
                                );
                            }
                            if (line.type === 'stderr') {
                                return (
                                    <div key={index} className="text-rose-400 whitespace-pre-wrap">
                                        {line.text}
                                    </div>
                                );
                            }
                            if (line.type === 'system') {
                                return (
                                    <div key={index} className="text-amber-500/80 italic">
                                        {line.text}
                                    </div>
                                );
                            }
                            return (
                                <div key={index} className="text-slate-100 whitespace-pre-wrap">
                                    {line.text}
                                </div>
                            );
                        })}

                        {/* Interactive prompt input */}
                        <form onSubmit={handleFormSubmit} className="flex items-center pt-1.5">
                            <span className="text-emerald-400 font-semibold mr-2 shrink-0">
                                admin@intema-panel:~$
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isRunning}
                                className="flex-1 bg-transparent border-0 p-0 text-slate-100 font-mono text-xs focus:ring-0 focus:outline-none placeholder-slate-600 disabled:opacity-50"
                                placeholder={isRunning ? 'Command running...' : 'Type a command...'}
                                autoFocus
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                        </form>
                        <div ref={terminalEndRef} />
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
