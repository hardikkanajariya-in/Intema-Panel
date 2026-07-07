<?php

namespace App\Providers;

use App\Models\Domain;
use App\Models\ManagedDatabase;
use App\Provision\ApplicationProvisioners\ApiProvisioner;
use App\Provision\ApplicationProvisioners\CustomProvisioner;
use App\Provision\ApplicationProvisioners\LaravelProvisioner;
use App\Provision\ApplicationProvisioners\NestProvisioner;
use App\Provision\ApplicationProvisioners\NextProvisioner;
use App\Provision\ApplicationProvisioners\PhpProvisioner;
use App\Provision\ApplicationProvisioners\StaticProvisioner;
use App\Provision\ProvisionerRegistry;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ProvisionerRegistry::class, function ($app): ProvisionerRegistry {
            return new ProvisionerRegistry([
                $app->make(LaravelProvisioner::class),
                $app->make(PhpProvisioner::class),
                $app->make(StaticProvisioner::class),
                $app->make(NextProvisioner::class),
                $app->make(NestProvisioner::class),
                $app->make(ApiProvisioner::class),
                $app->make(CustomProvisioner::class),
            ]);
        });
    }

    public function boot(): void
    {
        Route::bind('database', fn (string $value) => ManagedDatabase::query()->where('uuid', $value)->firstOrFail());
        Route::bind('domain', fn (string $value) => Domain::query()->where('uuid', $value)->firstOrFail());

        $this->configureDefaults();
        $this->configureRateLimiting();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('resource', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });
    }
}
