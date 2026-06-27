<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CloudflareController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DatabaseController;
use App\Http\Controllers\FileManagerController;
use App\Http\Controllers\NginxController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\SslController;
use App\Http\Controllers\SystemController;
use Illuminate\Support\Facades\Route;

Route::middleware('setup')->group(function () {
    Route::get('/setup', [SetupController::class, 'index'])->name('setup.index');
    Route::post('/setup', [SetupController::class, 'store'])->name('setup.store');

    Route::middleware('guest')->group(function () {
        Route::get('/login', [LoginController::class, 'create'])->name('login');
        Route::post('/login', [LoginController::class, 'store']);
    });

    Route::middleware('auth')->group(function () {
        Route::redirect('/', '/dashboard');

        Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
        Route::post('/appearance', [AppearanceController::class, 'update'])->name('appearance.update');

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('clients', ClientController::class);

        Route::get('/databases', [DatabaseController::class, 'index'])->name('databases.index');
        Route::post('/databases/{client}/backup', [DatabaseController::class, 'backup'])->name('databases.backup');
        Route::post('/databases/{client}/reset-password', [DatabaseController::class, 'resetPassword'])->name('databases.reset-password');

        Route::get('/nginx', [NginxController::class, 'index'])->name('nginx.index');
        Route::post('/nginx', [NginxController::class, 'store'])->name('nginx.store');
        Route::post('/nginx/{site}/enable', [NginxController::class, 'enable'])->name('nginx.enable');
        Route::post('/nginx/{site}/disable', [NginxController::class, 'disable'])->name('nginx.disable');
        Route::delete('/nginx/{site}', [NginxController::class, 'destroy'])->name('nginx.destroy');
        Route::post('/nginx/actions/test', [NginxController::class, 'test'])->name('nginx.test');
        Route::post('/nginx/actions/reload', [NginxController::class, 'reload'])->name('nginx.reload');
        Route::post('/nginx/actions/restart', [NginxController::class, 'restart'])->name('nginx.restart');

        Route::get('/ssl', [SslController::class, 'index'])->name('ssl.index');
        Route::post('/ssl', [SslController::class, 'store'])->name('ssl.store');
        Route::post('/ssl/renew', [SslController::class, 'renew'])->name('ssl.renew');
        Route::delete('/ssl/{domain}', [SslController::class, 'destroy'])->name('ssl.destroy');

        Route::get('/cloudflare', [CloudflareController::class, 'index'])->name('cloudflare.index');

        Route::get('/system', [SystemController::class, 'index'])->name('system.index');
        Route::post('/system/action', [SystemController::class, 'action'])->name('system.action');

        Route::get('/files', [FileManagerController::class, 'index'])->name('files.index');
        Route::get('/files/show/{path}', [FileManagerController::class, 'show'])->where('path', '.*')->name('files.show');
        Route::put('/files/{path}', [FileManagerController::class, 'update'])->where('path', '.*')->name('files.update');
        Route::get('/files/download/{path}', [FileManagerController::class, 'download'])->where('path', '.*')->name('files.download');

        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
    });
});
