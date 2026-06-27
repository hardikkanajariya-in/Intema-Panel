<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Dashboard/Index', [
            'stats' => $this->dashboardService->getStats()->toArray(),
        ]);
    }
}
