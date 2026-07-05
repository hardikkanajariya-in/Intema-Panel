<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Panel Branding
    |--------------------------------------------------------------------------
    */

    'name' => env('PANEL_NAME', 'Intema Panel'),

    'tagline' => env('PANEL_TAGLINE', 'Infrastructure Resource Manager'),

    'company' => env('PANEL_COMPANY', 'Hardik Kanajariya'),

    'website' => env('PANEL_WEBSITE', 'https://hardikkanajariya.in'),

    'github' => env('PANEL_GITHUB', 'https://github.com/hardikkanajariya-in/intema-panel'),

    'github_token' => env('PANEL_GITHUB_TOKEN'),

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

    'default_database_prefix' => env('PANEL_DATABASE_PREFIX', 'res_'),

    'default_resource_status' => env('PANEL_DEFAULT_RESOURCE_STATUS', 'active'),

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

    /*
    |--------------------------------------------------------------------------
    | Nginx
    |--------------------------------------------------------------------------
    */

    'nginx' => [
        'sites_available' => env('PANEL_NGINX_SITES_AVAILABLE', '/etc/nginx/sites-available'),
        'sites_enabled' => env('PANEL_NGINX_SITES_ENABLED', '/etc/nginx/sites-enabled'),
        'config_path' => env('PANEL_NGINX_CONFIG', '/etc/nginx/nginx.conf'),
    ],

    /*
    |--------------------------------------------------------------------------
    | SSL / Certbot
    |--------------------------------------------------------------------------
    */

    'ssl' => [
        'certbot_path' => env('PANEL_CERTBOT_PATH', '/usr/bin/certbot'),
        'email' => env('PANEL_SSL_EMAIL'),
    ],

    /*
    |--------------------------------------------------------------------------
    | File Manager
    |--------------------------------------------------------------------------
    */

    'files' => [
        'allowed_roots' => [
            base_path(),
            storage_path('logs'),
        ],
        'editable_files' => [
            base_path('.env'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Adminer
    |--------------------------------------------------------------------------
    */

    'adminer' => [
        'url' => env('PANEL_ADMINER_URL', '/adminer'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Bootstrap
    |--------------------------------------------------------------------------
    */

    'install_path' => env('PANEL_INSTALL_PATH', '/var/www/intema-panel'),

];
