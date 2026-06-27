<?php

namespace App\Http\Controllers;

use App\Services\FileManagerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileManagerController extends Controller
{
    public function __construct(
        private readonly FileManagerService $fileManagerService,
    ) {}

    public function index(Request $request): Response
    {
        $path = $request->string('path')->toString();

        return Inertia::render('Files/Index', [
            'path' => $path,
            'entries' => $this->fileManagerService->listDirectory($path),
        ]);
    }

    public function show(string $path): Response
    {
        return Inertia::render('Files/Show', [
            'path' => $path,
            'contents' => $this->fileManagerService->readFile($path),
            'editable' => $this->fileManagerService->isEditable($path),
        ]);
    }

    public function update(Request $request, string $path): RedirectResponse
    {
        $validated = $request->validate([
            'contents' => ['required', 'string'],
        ]);

        $this->fileManagerService->writeFile($path, $validated['contents']);

        return back()->with('success', 'File saved successfully.');
    }

    public function download(string $path): StreamedResponse
    {
        $contents = $this->fileManagerService->readFile($path);

        return response()->streamDownload(
            fn () => print ($contents),
            basename($path),
        );
    }
}
