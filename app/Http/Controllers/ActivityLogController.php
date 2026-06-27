<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogService;
use App\Support\ActivityLogResource;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function index(): Response
    {
        $logs = $this->activityLogService->paginate();

        return Inertia::render('ActivityLogs/Index', [
            'logs' => [
                'data' => ActivityLogResource::collection($logs->items()),
                'links' => $logs->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'last_page' => $logs->lastPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                ],
            ],
        ]);
    }
}
