<?php

namespace App\Http\Middleware;

use App\Services\SetupService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSetupComplete
{
    public function __construct(
        private readonly SetupService $setupService,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $isSetupRoute = $request->is('setup') || $request->is('setup/*');

        if (! $this->setupService->isComplete()) {
            if (! $isSetupRoute) {
                return redirect()->route('setup.index');
            }

            return $next($request);
        }

        if ($isSetupRoute) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
