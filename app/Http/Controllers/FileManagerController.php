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
        $path = $request->string('path', '/')->toString();

        if ($path === '' || $path === '.') {
            $path = '/';
        }

        $entries = [];
        $error = null;

        try {
            $entries = $this->fileManagerService->listDirectory($path);
        } catch (\Throwable $e) {
            $error = $e->getMessage();
        }

        return Inertia::render('Files/Index', [
            'path' => $path,
            'entries' => $entries,
            'error' => $error,
        ]);
    }

    public function show(Request $request): Response
    {
        $path = $request->string('path')->toString();
        $editable = false;
        $contents = '';
        $error = null;

        try {
            $contents = $this->fileManagerService->readFile($path);
            $editable = $this->fileManagerService->isEditable($path);
        } catch (\Throwable $e) {
            $error = $e->getMessage();
        }

        return Inertia::render('Files/Show', [
            'path' => $path,
            'contents' => $contents,
            'editable' => $editable,
            'error' => $error,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
            'contents' => ['required', 'string'],
        ]);

        try {
            $this->fileManagerService->writeFile($validated['path'], $validated['contents']);
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'File saved successfully.');
    }

    public function download(Request $request): StreamedResponse
    {
        $path = $request->string('path')->toString();
        $contents = $this->fileManagerService->readFile($path);

        return response()->streamDownload(
            fn () => print ($contents),
            basename($path),
        );
    }

    public function createDirectory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        try {
            $this->fileManagerService->createDirectory($validated['path'], $validated['name']);
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Directory created.');
    }

    public function createFile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        try {
            $this->fileManagerService->createFile($validated['path'], $validated['name']);
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'File created.');
    }

    public function delete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
        ]);

        try {
            $this->fileManagerService->delete($validated['path']);
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Deleted successfully.');
    }

    public function rename(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        try {
            $this->fileManagerService->rename($validated['path'], $validated['name']);
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Renamed successfully.');
    }
}
