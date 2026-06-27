<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class FileManagerService
{
    /**
     * @return list<array<string, string>>
     */
    public function listDirectory(string $path = ''): array
    {
        $absolute = $this->resolvePath($path);

        if (! is_dir($absolute)) {
            throw new FileNotFoundException("Directory not found: {$path}");
        }

        $entries = [];

        foreach (scandir($absolute) ?: [] as $entry) {
            if (in_array($entry, ['.', '..'], true)) {
                continue;
            }

            $full = $absolute.DIRECTORY_SEPARATOR.$entry;
            $entries[] = [
                'name' => $entry,
                'path' => $this->relativePath($full),
                'type' => is_dir($full) ? 'directory' : 'file',
                'size' => is_file($full) ? (string) filesize($full) : '',
            ];
        }

        usort($entries, fn (array $a, array $b): int => strcmp($a['name'], $b['name']));

        return $entries;
    }

    public function readFile(string $path): string
    {
        $absolute = $this->resolvePath($path);

        if (! is_file($absolute)) {
            throw new FileNotFoundException("File not found: {$path}");
        }

        if (! $this->isReadableFile($absolute)) {
            throw new \RuntimeException('File is not readable.');
        }

        $contents = file_get_contents($absolute);

        if ($contents === false) {
            throw new \RuntimeException('Unable to read file.');
        }

        return $contents;
    }

    public function writeFile(string $path, string $contents): void
    {
        $absolute = $this->resolvePath($path);

        if (! $this->isEditableFile($absolute)) {
            throw new \RuntimeException('File is not editable.');
        }

        File::put($absolute, $contents);
    }

    public function isEditable(string $path): bool
    {
        try {
            return $this->isEditableFile($this->resolvePath($path));
        } catch (\Throwable) {
            return false;
        }
    }

    private function resolvePath(string $path): string
    {
        $path = trim(str_replace(['\\', "\0"], ['/', ''], $path), '/');
        $candidate = $path === '' ? base_path() : base_path($path);
        $real = realpath($candidate);

        if ($real === false) {
            $parent = dirname($candidate);
            $realParent = realpath($parent);

            if ($realParent === false) {
                throw new FileNotFoundException('Path not found.');
            }

            $real = $realParent.DIRECTORY_SEPARATOR.basename($candidate);
        }

        foreach ((array) config('panel.files.allowed_roots') as $root) {
            $rootReal = realpath((string) $root);

            if ($rootReal !== false && str_starts_with($real, $rootReal)) {
                return $real;
            }
        }

        throw new \RuntimeException('Path is outside allowed directories.');
    }

    private function relativePath(string $absolute): string
    {
        $base = realpath(base_path()) ?: base_path();

        return ltrim(str_replace($base, '', $absolute), DIRECTORY_SEPARATOR);
    }

    private function isReadableFile(string $absolute): bool
    {
        if (str_ends_with($absolute, '.log') || str_contains($absolute, 'storage'.DIRECTORY_SEPARATOR.'logs')) {
            return is_readable($absolute);
        }

        return is_readable($absolute) && is_file($absolute);
    }

    private function isEditableFile(string $absolute): bool
    {
        foreach ((array) config('panel.files.editable_files') as $editable) {
            $editableReal = realpath((string) $editable);

            if ($editableReal !== false && $editableReal === realpath($absolute)) {
                return true;
            }
        }

        return false;
    }
}
