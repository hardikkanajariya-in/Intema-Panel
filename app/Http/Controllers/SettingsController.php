<?php

namespace App\Http\Controllers;

use App\Actions\UpdateSettingsAction;
use App\Http\Requests\UpdateSettingsRequest;
use App\Services\SettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(
        private readonly SettingService $settingService,
        private readonly UpdateSettingsAction $updateSettingsAction,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'settings' => $this->settingService->forPanel(),
            'timezones' => timezone_identifiers_list(),
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $this->updateSettingsAction->execute($request->validated());

        return redirect()
            ->route('settings.index')
            ->with('success', 'Settings updated successfully.');
    }
}
