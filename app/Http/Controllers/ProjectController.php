<?php

namespace App\Http\Controllers;

use App\Actions\CreateProjectAction;
use App\Actions\DeleteProjectAction;
use App\Actions\UpdateProjectAction;
use App\DTOs\ProjectData;
use App\Enums\ResourceStatus;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Support\ApplicationResource;
use App\Support\DomainResource;
use App\Support\ManagedDatabaseResource;
use App\Support\ProjectResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly CreateProjectAction $createProjectAction,
        private readonly UpdateProjectAction $updateProjectAction,
        private readonly DeleteProjectAction $deleteProjectAction,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $projects = Project::query()
            ->withCount(['applications', 'databases', 'domains'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Projects/Index', [
            'projects' => [
                'data' => ProjectResource::collection($projects->items())->resolve(),
                'links' => $projects->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $projects->currentPage(),
                    'last_page' => $projects->lastPage(),
                    'per_page' => $projects->perPage(),
                    'total' => $projects->total(),
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Projects/Create', [
            'statuses' => ResourceStatus::values(),
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $project = $this->createProjectAction->execute(
            ProjectData::fromArray($request->validated()),
        );

        return redirect()
            ->route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->loadCount(['applications', 'databases', 'domains', 'sslCertificates']);
        $project->load(['applications', 'databases', 'domains']);

        return Inertia::render('Projects/Show', [
            'project' => ProjectResource::make($project),
            'applications' => ApplicationResource::collection($project->applications)->resolve(),
            'databases' => ManagedDatabaseResource::collection($project->databases)->resolve(),
            'domains' => DomainResource::collection($project->domains)->resolve(),
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('Projects/Edit', [
            'project' => ProjectResource::make($project),
            'statuses' => ResourceStatus::values(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $this->updateProjectAction->execute(
            $project,
            ProjectData::fromArray($request->validated()),
        );

        return redirect()
            ->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $this->deleteProjectAction->execute($project);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
