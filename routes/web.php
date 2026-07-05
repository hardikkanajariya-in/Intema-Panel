<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DomainController;
use App\Http\Controllers\FileManagerController;
use App\Http\Controllers\GithubWebhookController;
use App\Http\Controllers\GithubController;
use App\Http\Controllers\ManagedDatabaseController;
use App\Http\Controllers\NginxController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResourceWizardController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\SslCertificateController;
use App\Http\Controllers\SystemController;
use Illuminate\Support\Facades\Route;

Route::post('/api/webhooks/github', [GithubWebhookController::class, 'handle'])->name('api.webhooks.github');

Route::middleware('setup')->group(function () {
    Route::get('/setup', [SetupController::class, 'index'])->name('setup.index');
    Route::post('/setup', [SetupController::class, 'store'])->name('setup.store');

    Route::middleware('guest')->group(function () {
        Route::get('/login', [LoginController::class, 'create'])->name('login');
        Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:login');
    });

    Route::middleware('auth')->group(function () {
        Route::redirect('/', '/dashboard');

        Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
        Route::post('/appearance', [AppearanceController::class, 'update'])->name('appearance.update');

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('projects', ProjectController::class);

        Route::get('/resources/create', [ResourceWizardController::class, 'create'])->name('resources.create');
        Route::post('/resources', [ResourceWizardController::class, 'store'])
            ->middleware('throttle:resource')
            ->name('resources.store');

        Route::resource('applications', ApplicationController::class)->only(['index', 'show', 'destroy']);
        Route::post('/applications/{application}/repair', [ApplicationController::class, 'repair'])->name('applications.repair');
        Route::post('/applications/{application}/health', [ApplicationController::class, 'health'])->name('applications.health');
        Route::post('/applications/{application}/deploy', [ApplicationController::class, 'deploy'])->name('applications.deploy');
        Route::post('/applications/{application}/runtime', [ApplicationController::class, 'runtime'])->name('applications.runtime');
        Route::post('/applications/{application}/attach-database', [ApplicationController::class, 'attachDatabase'])->name('applications.attach-database');
        Route::delete('/applications/{application}/databases/{database}', [ApplicationController::class, 'detachDatabase'])->name('applications.detach-database');
        Route::post('/applications/{application}/attach-domain', [ApplicationController::class, 'attachDomain'])->name('applications.attach-domain');
        Route::delete('/applications/{application}/domains/{domain}', [ApplicationController::class, 'detachDomain'])->name('applications.detach-domain');

        Route::resource('databases', ManagedDatabaseController::class)->only(['index', 'show', 'destroy']);
        Route::post('/databases/{database}/backup', [ManagedDatabaseController::class, 'backup'])->name('databases.backup');
        Route::post('/databases/{database}/reset-password', [ManagedDatabaseController::class, 'resetPassword'])->name('databases.reset-password');

        Route::resource('domains', DomainController::class)->only(['index', 'show', 'destroy']);
        Route::post('/domains/{domain}/attach-ssl', [DomainController::class, 'attachSsl'])->name('domains.attach-ssl');
        Route::delete('/domains/{domain}/detach-ssl', [DomainController::class, 'detachSsl'])->name('domains.detach-ssl');

        Route::resource('ssl-certificates', SslCertificateController::class)->only(['index', 'show', 'destroy']);
        Route::post('/ssl-certificates/{ssl_certificate}/renew', [SslCertificateController::class, 'renew'])->name('ssl-certificates.renew');

        Route::get('/nginx', [NginxController::class, 'index'])->name('nginx.index');
        Route::post('/nginx', [NginxController::class, 'store'])->name('nginx.store');
        Route::post('/nginx/{site}/enable', [NginxController::class, 'enable'])->name('nginx.enable');
        Route::post('/nginx/{site}/disable', [NginxController::class, 'disable'])->name('nginx.disable');
        Route::delete('/nginx/{site}', [NginxController::class, 'destroy'])->name('nginx.destroy');
        Route::post('/nginx/actions/test', [NginxController::class, 'test'])->name('nginx.test');
        Route::post('/nginx/actions/reload', [NginxController::class, 'reload'])->name('nginx.reload');
        Route::post('/nginx/actions/restart', [NginxController::class, 'restart'])->name('nginx.restart');

        Route::get('/system', [SystemController::class, 'index'])->name('system.index');
        Route::post('/system/action', [SystemController::class, 'action'])->name('system.action');
        Route::post('/system/update', [SystemController::class, 'update'])->name('system.update');

        Route::get('/files', [FileManagerController::class, 'index'])->name('files.index');
        Route::get('/files/show', [FileManagerController::class, 'show'])->name('files.show');
        Route::put('/files', [FileManagerController::class, 'update'])->name('files.update');
        Route::get('/files/download', [FileManagerController::class, 'download'])->name('files.download');
        Route::post('/files/create-directory', [FileManagerController::class, 'createDirectory'])->name('files.create-directory');
        Route::post('/files/create-file', [FileManagerController::class, 'createFile'])->name('files.create-file');
        Route::delete('/files', [FileManagerController::class, 'delete'])->name('files.delete');
        Route::post('/files/rename', [FileManagerController::class, 'rename'])->name('files.rename');

        Route::get('/github/repositories', [GithubController::class, 'repositories'])->name('github.repositories');
        Route::get('/github/branches', [GithubController::class, 'branches'])->name('github.branches');

        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
    });
});
