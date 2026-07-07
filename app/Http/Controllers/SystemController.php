<?php

namespace App\Http\Controllers;

use App\Services\MonitoringService;
use App\Services\SystemManagerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemController extends Controller
{
    public function __construct(
        private readonly MonitoringService $monitoringService,
        private readonly SystemManagerService $systemManagerService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('System/Index', [
            'monitoring' => $this->monitoringService->snapshot(),
            'components' => $this->systemManagerService->components(),
        ]);
    }

    public function action(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'component' => ['required', 'string'],
            'action' => ['required', 'in:install,update,repair,validate,start,stop,restart,reload'],
        ]);

        $this->systemManagerService->performAction(
            $validated['component'],
            $validated['action'],
        );

        return back()->with('success', 'Service action completed successfully.');
    }

    public function update(): RedirectResponse
    {
        $updateScript = base_path('bootstrap/update.sh');

        if (! is_file($updateScript)) {
            return back()->with('error', 'Update script not found.');
        }

        // Run update in background
        $log = storage_path('logs/panel_update.log');
        $command = "bash " . escapeshellarg($updateScript) . " > " . escapeshellarg($log) . " 2>&1 &";
        exec($command);

        return back()->with('success', 'Panel update triggered in the background. Please wait a few moments for the services to restart.');
    }

    public function terminal(): Response
    {
        return Inertia::render('System/Terminal', [
            'initialCwd' => base_path(),
        ]);
    }

    public function runTerminalCommand(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $validated = $request->validate([
            'command' => ['required', 'string'],
            'cwd' => ['nullable', 'string'],
        ]);

        $command = $validated['command'];
        $cwd = $validated['cwd'] ?: base_path();

        return new \Symfony\Component\HttpFoundation\StreamedResponse(function () use ($command, $cwd) {
            if (ob_get_level() > 0) {
                ob_end_clean();
            }

            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            header('Connection: keep-alive');
            header('X-Accel-Buffering: no');

            // Format command to execute and append the unique PWD marker
            $shellCommand = "cd " . escapeshellarg($cwd) . " && (" . $command . ") ; echo -n '__INTERNAL_PANEL_PWD_MARKER__' && pwd";

            $process = \Symfony\Component\Process\Process::fromShellCommandline($shellCommand);
            $process->setTimeout(null);

            $currentCwd = $cwd;

            $process->run(function ($type, $buffer) use (&$currentCwd) {
                if ($type === \Symfony\Component\Process\Process::OUT && str_contains($buffer, '__INTERNAL_PANEL_PWD_MARKER__')) {
                    $parts = explode('__INTERNAL_PANEL_PWD_MARKER__', $buffer);
                    $output = $parts[0];
                    $newCwd = trim($parts[1]);

                    if ($output !== '') {
                        echo "data: " . json_encode([
                            'type' => 'stdout',
                            'output' => $output,
                        ]) . "\n\n";
                    }

                    if ($newCwd !== '') {
                        $currentCwd = $newCwd;
                    }
                } else {
                    echo "data: " . json_encode([
                        'type' => $type === \Symfony\Component\Process\Process::ERR ? 'stderr' : 'stdout',
                        'output' => $buffer,
                    ]) . "\n\n";
                }

                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
            });

            echo "data: " . json_encode([
                'type' => 'exit',
                'code' => $process->getExitCode(),
                'cwd' => $currentCwd,
            ]) . "\n\n";

            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
