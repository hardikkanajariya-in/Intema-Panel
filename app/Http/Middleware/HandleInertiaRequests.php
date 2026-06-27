<?php

namespace App\Http\Middleware;

use App\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        /** @var SettingService $settings */
        $settings = app(SettingService::class);

        return [
            ...parent::share($request),
            'name' => $settings->get('panel_name', config('panel.name')),
            'panel' => [
                'name' => $settings->get('panel_name', config('panel.name')),
                'tagline' => config('panel.tagline'),
                'company' => $settings->get('company_name', config('panel.company')),
                'website' => $settings->get('website', config('panel.website')),
                'github' => $settings->get('github_url', config('panel.github')),
                'support_email' => $settings->get('support_email', config('panel.support_email')),
                'version' => config('panel.version'),
                'license' => config('panel.license'),
            ],
            'auth' => [
                'user' => $request->user(),
            ],
            'appearance' => $request->cookie('appearance', $settings->get('theme', 'system')),
            'sidebarOpen' => true,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
