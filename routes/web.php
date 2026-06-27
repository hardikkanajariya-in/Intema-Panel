<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CloudflareController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DatabaseController;
use App\Http\Controllers\NginxController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SslController;
use App\Http\Controllers\SystemController;
use Illuminate\Support\Facades\Route;

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
    Route::get('/nginx', [NginxController::class, 'index'])->name('nginx.index');
    Route::get('/ssl', [SslController::class, 'index'])->name('ssl.index');
    Route::get('/cloudflare', [CloudflareController::class, 'index'])->name('cloudflare.index');
    Route::get('/system', [SystemController::class, 'index'])->name('system.index');
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
});
