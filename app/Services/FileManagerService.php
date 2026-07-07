<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class FileManagerService
{
    /**
     * @return list<array<string, mixed>>
     */
    public function listDirectory(string $path = '/'): array
    {
        $absolute = $this->resolvePath($path);

        if (! is_dir($absolute)) {
            throw new FileNotFoundException("Directory not found: {$path}");
        }

        if (! is_readable($absolute)) {
            throw new \RuntimeException("Permission denied: {$path}");
        }

        $entries = [];
        $dirSizes = [];

        if (DIRECTORY_SEPARATOR === '/' && is_readable($absolute)) {
            // Run du to get sizes of all child folders/files (including hidden dotfiles) in one command
            exec("cd " . escapeshellarg($absolute) . " && du -sb --max-depth=1 . 2>/dev/null", $output, $status);
            if ($status === 0) {
                foreach ($output as $line) {
                    $parts = preg_split('/\s+/', $line, 2);
                    if (count($parts) === 2) {
                        $bytes = (int) $parts[0];
                        $entryName = basename($parts[1]);
                        $dirSizes[$entryName] = $bytes;
                    }
                }
            }
        }

        foreach (scandir($absolute) ?: [] as $entry) {
            if ($entry === '.') {
                continue;
            }

            $full = rtrim($absolute, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $entry;
            $isDir = is_dir($full);
            $isSymlink = is_link($full);

            $size = 0;
            $readable = is_readable($full);

            if (! $isDir && $readable) {
                $size = @filesize($full) ?: 0;
            } elseif ($isDir && $entry !== '..') {
                $size = $dirSizes[$entry] ?? 0;
            }

            $perms = '';
            $owner = '';
            $group = '';
            $modified = '';

            if ($readable || $isDir) {
                $stat = @stat($full);

                if ($stat !== false) {
                    $perms = $this->formatPermissions($stat['mode']);
                    $owner = function_exists('posix_getpwuid')
                        ? (posix_getpwuid($stat['uid'])['name'] ?? (string) $stat['uid'])
                        : (string) $stat['uid'];
                    $group = function_exists('posix_getgrgid')
                        ? (posix_getgrgid($stat['gid'])['name'] ?? (string) $stat['gid'])
                        : (string) $stat['gid'];
                    $modified = date('Y-m-d H:i:s', $stat['mtime']);
                }
            }

            $entryPath = $entry === '..'
                ? dirname($absolute)
                : $full;

            $entries[] = [
                'name' => $entry,
                'path' => $entryPath,
                'type' => $isDir ? 'directory' : 'file',
                'size' => $size,
                'size_formatted' => ($isDir && $entry === '..') ? '—' : $this->formatSize($size),
                'permissions' => $perms,
                'owner' => $owner,
                'group' => $group,
                'modified' => $modified,
                'readable' => $readable,
                'writable' => is_writable($full),
                'symlink' => $isSymlink,
                'extension' => $isDir ? '' : strtolower(pathinfo($entry, PATHINFO_EXTENSION)),
            ];
        }

        usort($entries, function (array $a, array $b): int {
            if ($a['name'] === '..') {
                return -1;
            }
            if ($b['name'] === '..') {
                return 1;
            }

            if ($a['type'] !== $b['type']) {
                return $a['type'] === 'directory' ? -1 : 1;
            }

            return strcasecmp($a['name'], $b['name']);
        });

        return $entries;
    }

    public function readFile(string $path): string
    {
        $absolute = $this->resolvePath($path);

        $isFile = @is_file($absolute);
        if (! $isFile && DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'test', '-f', $absolute]);
            $process->run();
            $isFile = $process->isSuccessful();
        }

        if (! $isFile) {
            throw new FileNotFoundException("File not found: {$path}");
        }

        $contents = false;
        if (@is_readable($absolute)) {
            $size = @filesize($absolute) ?: 0;
            if ($size <= 2 * 1024 * 1024) {
                $contents = @file_get_contents($absolute);
            } else {
                throw new \RuntimeException('File is too large to display (max 2 MB).');
            }
        }

        if ($contents === false) {
            if (DIRECTORY_SEPARATOR === '/') {
                $process = new \Symfony\Component\Process\Process(['sudo', 'cat', $absolute]);
                $process->run();
                if ($process->isSuccessful()) {
                    $contents = $process->getOutput();
                }
            }
        }

        if ($contents === false) {
            throw new \RuntimeException('Unable to read file.');
        }

        if (strlen($contents) > 2 * 1024 * 1024) {
            throw new \RuntimeException('File is too large to display (max 2 MB).');
        }

        return $contents;
    }

    public function writeFile(string $path, string $contents): void
    {
        $absolute = $this->resolvePath($path);

        if (@is_writable($absolute)) {
            if (@file_put_contents($absolute, $contents) !== false) {
                return;
            }
        }

        if (DIRECTORY_SEPARATOR === '/') {
            $tempFile = tempnam(sys_get_temp_dir(), 'panel_edit_');
            if ($tempFile === false) {
                throw new \RuntimeException('Failed to create temporary file.');
            }
            if (file_put_contents($tempFile, $contents) === false) {
                @unlink($tempFile);
                throw new \RuntimeException('Failed to write to temporary file.');
            }

            $process = new \Symfony\Component\Process\Process(['sudo', 'cp', $tempFile, $absolute]);
            $process->run();
            @unlink($tempFile);

            if ($process->isSuccessful()) {
                return;
            }
            throw new \RuntimeException('Permission denied: failed to copy via sudo cp. ' . $process->getErrorOutput());
        }

        throw new \RuntimeException('Permission denied: file is not writable.');
    }

    public function isEditable(string $path): bool
    {
        try {
            $absolute = $this->resolvePath($path);

            $isFile = @is_file($absolute);
            if (! $isFile && DIRECTORY_SEPARATOR === '/') {
                $process = new \Symfony\Component\Process\Process(['sudo', 'test', '-f', $absolute]);
                $process->run();
                $isFile = $process->isSuccessful();
            }

            return $isFile;
        } catch (\Throwable) {
            return false;
        }
    }

    public function createDirectory(string $path, string $name): void
    {
        $absolute = $this->resolvePath($path);
        $target = rtrim($absolute, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;

        $exists = @file_exists($target);
        if (! $exists && DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'test', '-e', $target]);
            $process->run();
            $exists = $process->isSuccessful();
        }

        if ($exists) {
            throw new \RuntimeException("Already exists: {$name}");
        }

        if (@mkdir($target, 0755, true)) {
            return;
        }

        if (DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'mkdir', '-p', $target]);
            $process->run();
            if ($process->isSuccessful()) {
                return;
            }
            throw new \RuntimeException("Failed to create directory via sudo mkdir: " . $process->getErrorOutput());
        }

        throw new \RuntimeException("Failed to create directory. Check permissions.");
    }

    public function createFile(string $path, string $name): void
    {
        $absolute = $this->resolvePath($path);
        $target = rtrim($absolute, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;

        $exists = @file_exists($target);
        if (! $exists && DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'test', '-e', $target]);
            $process->run();
            $exists = $process->isSuccessful();
        }

        if ($exists) {
            throw new \RuntimeException("Already exists: {$name}");
        }

        if (@file_put_contents($target, '') !== false) {
            return;
        }

        if (DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'touch', $target]);
            $process->run();
            if ($process->isSuccessful()) {
                return;
            }
            throw new \RuntimeException("Failed to create file via sudo touch: " . $process->getErrorOutput());
        }

        throw new \RuntimeException("Failed to create file. Check permissions.");
    }

    public function delete(string $path): void
    {
        $absolute = $this->resolvePath($path);

        if ($absolute === '/') {
            throw new \RuntimeException('Cannot delete root directory.');
        }

        $isDir = @is_dir($absolute);
        if (! $isDir && DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'test', '-d', $absolute]);
            $process->run();
            $isDir = $process->isSuccessful();
        }

        if ($isDir) {
            try {
                $this->deleteDirectory($absolute);
            } catch (\Throwable $e) {
                if (DIRECTORY_SEPARATOR === '/') {
                    $process = new \Symfony\Component\Process\Process(['sudo', 'rm', '-rf', $absolute]);
                    $process->run();
                    if ($process->isSuccessful()) {
                        return;
                    }
                    throw new \RuntimeException("Failed to delete directory via sudo rm: " . $process->getErrorOutput());
                }
                throw $e;
            }
        } else {
            if (@unlink($absolute)) {
                return;
            }

            if (DIRECTORY_SEPARATOR === '/') {
                $process = new \Symfony\Component\Process\Process(['sudo', 'rm', '-f', $absolute]);
                $process->run();
                if ($process->isSuccessful()) {
                    return;
                }
                throw new \RuntimeException("Failed to delete file via sudo rm: " . $process->getErrorOutput());
            }

            throw new \RuntimeException("Failed to delete file. Check permissions.");
        }
    }

    public function rename(string $path, string $newName): void
    {
        $absolute = $this->resolvePath($path);
        $parent = dirname($absolute);
        $target = $parent . DIRECTORY_SEPARATOR . $newName;

        $exists = @file_exists($target);
        if (! $exists && DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'test', '-e', $target]);
            $process->run();
            $exists = $process->isSuccessful();
        }

        if ($exists) {
            throw new \RuntimeException("Already exists: {$newName}");
        }

        if (@rename($absolute, $target)) {
            return;
        }

        if (DIRECTORY_SEPARATOR === '/') {
            $process = new \Symfony\Component\Process\Process(['sudo', 'mv', $absolute, $target]);
            $process->run();
            if ($process->isSuccessful()) {
                return;
            }
            throw new \RuntimeException("Failed to rename via sudo mv: " . $process->getErrorOutput());
        }

        throw new \RuntimeException("Failed to rename. Check permissions.");
    }

    private function resolvePath(string $path): string
    {
        $path = str_replace(["\0", '\\'], ['', '/'], $path);

        if ($path === '' || $path === '/') {
            return '/';
        }

        $path = '/' . ltrim($path, '/');

        $real = realpath($path);

        if ($real === false) {
            $parent = realpath(dirname($path));

            if ($parent === false) {
                throw new FileNotFoundException("Path not found: {$path}");
            }

            return $parent . DIRECTORY_SEPARATOR . basename($path);
        }

        return $real;
    }

    private function formatSize(int $bytes): string
    {
        if ($bytes === 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = 0;
        $size = (float) $bytes;

        while ($size >= 1024 && $i < count($units) - 1) {
            $size /= 1024;
            $i++;
        }

        return round($size, $i === 0 ? 0 : 1) . ' ' . $units[$i];
    }

    private function formatPermissions(int $mode): string
    {
        $permissions = '';

        $permissions .= ($mode & 0x0100) ? 'r' : '-';
        $permissions .= ($mode & 0x0080) ? 'w' : '-';
        $permissions .= ($mode & 0x0040) ? 'x' : '-';

        $permissions .= ($mode & 0x0020) ? 'r' : '-';
        $permissions .= ($mode & 0x0010) ? 'w' : '-';
        $permissions .= ($mode & 0x0008) ? 'x' : '-';

        $permissions .= ($mode & 0x0004) ? 'r' : '-';
        $permissions .= ($mode & 0x0002) ? 'w' : '-';
        $permissions .= ($mode & 0x0001) ? 'x' : '-';

        return $permissions;
    }

    private function isTextFile(string $absolute): bool
    {
        $textExtensions = [
            'txt', 'md', 'json', 'xml', 'yml', 'yaml', 'csv', 'log',
            'env', 'ini', 'cfg', 'conf', 'htaccess', 'gitignore',
            'php', 'js', 'ts', 'tsx', 'jsx', 'css', 'scss', 'less',
            'html', 'htm', 'vue', 'svelte', 'blade.php',
            'py', 'rb', 'go', 'rs', 'java', 'kt', 'c', 'cpp', 'h',
            'sh', 'bash', 'zsh', 'fish',
            'sql', 'graphql', 'prisma',
            'lock', 'toml', 'editorconfig', 'prettierrc', 'eslintrc',
        ];

        $ext = strtolower(pathinfo($absolute, PATHINFO_EXTENSION));

        if (in_array($ext, $textExtensions, true)) {
            return true;
        }

        $basename = strtolower(basename($absolute));

        return in_array($basename, ['.env', '.env.example', '.gitignore', '.htaccess', 'Makefile', 'Dockerfile', 'Vagrantfile'], true);
    }

    private function deleteDirectory(string $dir): void
    {
        if (DIRECTORY_SEPARATOR === '/') {
            exec("rm -rf " . escapeshellarg($dir) . " 2>&1", $output, $status);
            if ($status !== 0) {
                throw new \RuntimeException("Failed to remove directory: " . implode("\n", $output));
            }
            return;
        }

        $items = scandir($dir);

        if ($items === false) {
            throw new \RuntimeException("Cannot read directory for deletion.");
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            $path = $dir . DIRECTORY_SEPARATOR . $item;

            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                if (! @unlink($path)) {
                    throw new \RuntimeException("Failed to delete: {$path}");
                }
            }
        }

        if (! @rmdir($dir)) {
            throw new \RuntimeException("Failed to remove directory: {$dir}");
        }
    }
}
