<?php

namespace App\Http\Controllers;

use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GithubController extends Controller
{
    public function __construct(
        private readonly SettingService $settingService,
    ) {}

    public function repositories(): JsonResponse
    {
        $token = $this->settingService->get('github_token');

        if (! $token) {
            return response()->json(['message' => 'GitHub Personal Access Token not configured.'], 400);
        }

        try {
            $response = Http::withToken($token)
                ->get('https://api.github.com/user/repos', [
                    'per_page' => 100,
                    'sort' => 'updated',
                ]);

            if ($response->failed()) {
                return response()->json(['message' => 'GitHub API error: ' . ($response->json('message') ?? 'Unknown error')], $response->status());
            }

            $repos = collect($response->json())->map(function ($repo) {
                return [
                    'name' => $repo['full_name'],
                    'clone_url' => $repo['clone_url'],
                    'ssh_url' => $repo['ssh_url'],
                    'private' => $repo['private'],
                    'default_branch' => $repo['default_branch'],
                ];
            })->values()->all();

            return response()->json($repos);
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function branches(Request $request): JsonResponse
    {
        $token = $this->settingService->get('github_token');
        $repo = $request->query('repo');

        if (! $token) {
            return response()->json(['message' => 'GitHub Personal Access Token not configured.'], 400);
        }

        if (! $repo) {
            return response()->json(['message' => 'Repository name is required.'], 400);
        }

        try {
            $response = Http::withToken($token)
                ->get("https://api.github.com/repos/{$repo}/branches", [
                    'per_page' => 100,
                ]);

            if ($response->failed()) {
                return response()->json(['message' => 'GitHub API error: ' . ($response->json('message') ?? 'Unknown error')], $response->status());
            }

            $branches = collect($response->json())->map(function ($branch) {
                return $branch['name'];
            })->values()->all();

            return response()->json($branches);
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
