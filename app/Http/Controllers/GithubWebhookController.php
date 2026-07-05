<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GithubWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();

        // Ensure we have repository and ref payload
        if (! isset($payload['repository']) || ! isset($payload['ref'])) {
            return response()->json(['message' => 'Invalid payload: missing repository or ref.'], 400);
        }

        $repoUrl = $payload['repository']['clone_url'] 
            ?? $payload['repository']['ssh_url'] 
            ?? $payload['repository']['html_url'] 
            ?? null;

        if (! $repoUrl) {
            return response()->json(['message' => 'No repository URL found in payload.'], 400);
        }

        $repoIdentifier = $this->getRepoIdentifier($repoUrl);
        if (! $repoIdentifier) {
            return response()->json(['message' => 'Could not parse repository identifier.'], 400);
        }

        $ref = (string) $payload['ref'];
        $pushedBranch = str_replace('refs/heads/', '', $ref);

        // Fetch applications matching this repository
        $applications = Application::query()
            ->whereNotNull('repository_url')
            ->get();

        $matchedApps = [];

        foreach ($applications as $application) {
            $appRepoIdentifier = $this->getRepoIdentifier($application->repository_url);

            if ($appRepoIdentifier === $repoIdentifier && $application->repository_branch === $pushedBranch) {
                // Verify signature if a webhook secret is configured
                $signature = $request->header('X-Hub-Signature-256');
                if ($signature && $application->webhook_secret) {
                    $payloadRaw = $request->getContent();
                    $expected = 'sha256=' . hash_hmac('sha256', $payloadRaw, $application->webhook_secret);

                    if (! hash_equals($expected, $signature)) {
                        Log::warning("GitHub webhook signature mismatch for Application UUID: {$application->uuid}");
                        continue;
                    }
                }

                $matchedApps[] = $application;
            }
        }

        if (empty($matchedApps)) {
            return response()->json([
                'message' => 'No matching applications found for repository ' . $repoIdentifier . ' on branch ' . $pushedBranch,
            ]);
        }

        $deployedCount = 0;
        foreach ($matchedApps as $app) {
            // Trigger deployment in the background asynchronously
            $artisan = base_path('artisan');
            $command = "php {$artisan} app:deploy " . escapeshellarg($app->uuid) . " > /dev/null 2>&1 &";
            exec($command);
            $deployedCount++;
        }

        return response()->json([
            'message' => "Deployment triggered for {$deployedCount} application(s).",
        ]);
    }

    private function getRepoIdentifier(string $url): ?string
    {
        $url = trim($url);

        // Match patterns like owner/repo from https://github.com/owner/repo.git or git@github.com:owner/repo.git
        if (preg_match('/github\.com[:\/](.+?)(?:\.git)?$/i', $url, $matches)) {
            return strtolower(trim($matches[1], '/'));
        }

        return null;
    }
}
