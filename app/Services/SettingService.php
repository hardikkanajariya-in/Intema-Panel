<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    private const CACHE_KEY = 'panel.settings';

    /**
     * @var array<string, string>
     */
    private const DEFAULTS = [
        'panel_name' => 'panel.name',
        'company_name' => 'panel.company',
        'website' => 'panel.website',
        'support_email' => 'panel.support_email',
        'timezone' => 'panel.timezone',
        'theme' => 'panel.theme',
        'github_url' => 'panel.github',
        'default_database_prefix' => 'panel.default_database_prefix',
        'default_client_status' => 'panel.default_client_status',
    ];

    public function get(string $key, mixed $default = null): mixed
    {
        $settings = $this->all();

        if (array_key_exists($key, $settings)) {
            return $settings[$key];
        }

        if ($default !== null) {
            return $default;
        }

        if (isset(self::DEFAULTS[$key])) {
            return config(self::DEFAULTS[$key]);
        }

        return null;
    }

    public function set(string $key, ?string $value): void
    {
        Setting::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value],
        );

        Cache::forget(self::CACHE_KEY);
    }

    /**
     * @param  array<string, string|null>  $values
     */
    public function setMany(array $values): void
    {
        foreach ($values as $key => $value) {
            $this->set($key, $value);
        }
    }

    /**
     * @return array<string, string|null>
     */
    public function all(): array
    {
        /** @var array<string, string|null> $settings */
        $settings = Cache::rememberForever(self::CACHE_KEY, function (): array {
            return Setting::query()
                ->pluck('value', 'key')
                ->all();
        });

        return $settings;
    }

    /**
     * @return array<string, string|null>
     */
    public function forPanel(): array
    {
        $values = [];

        foreach (array_keys(self::DEFAULTS) as $key) {
            $values[$key] = (string) $this->get($key, '');
        }

        return $values;
    }
}
