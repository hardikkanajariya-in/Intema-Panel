<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Panel Branding
    |--------------------------------------------------------------------------
    */

    'name' => env('PANEL_NAME', 'Intema Panel'),

    'tagline' => env('PANEL_TAGLINE', 'Open Source Lightweight Hosting Control Panel'),

    'company' => env('PANEL_COMPANY', 'Hardik Kanajariya'),

    'website' => env('PANEL_WEBSITE', 'https://hardikkanajariya.in'),

    'github' => env('PANEL_GITHUB', 'https://github.com/hardikkanajariya/intema-panel'),

    'support_email' => env('PANEL_SUPPORT_EMAIL', 'hello@hardikkanajariya.in'),

    'version' => env('PANEL_VERSION', '1.0.0'),

    'license' => 'MIT',

    /*
    |--------------------------------------------------------------------------
    | Defaults
    |--------------------------------------------------------------------------
    */

    'timezone' => env('PANEL_TIMEZONE', 'UTC'),

    'theme' => env('PANEL_THEME', 'system'),

    'default_database_prefix' => env('PANEL_DATABASE_PREFIX', 'client_'),

    'default_client_status' => env('PANEL_DEFAULT_CLIENT_STATUS', 'active'),

    /*
    |--------------------------------------------------------------------------
    | PostgreSQL Administration
    |--------------------------------------------------------------------------
    */

    'postgres' => [
        'host' => env('PANEL_PG_HOST', '127.0.0.1'),
        'port' => env('PANEL_PG_PORT', '5432'),
        'admin_user' => env('PANEL_PG_ADMIN_USER', 'postgres'),
        'admin_password' => env('PANEL_PG_ADMIN_PASSWORD'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Shell Execution
    |--------------------------------------------------------------------------
    */

    'scripts_path' => env('PANEL_SCRIPTS_PATH', base_path('scripts')),

    'shell' => [
        'timeout' => (int) env('PANEL_SHELL_TIMEOUT', 60),
        'enabled' => env('PANEL_SHELL_ENABLED', true),
    ],

];
