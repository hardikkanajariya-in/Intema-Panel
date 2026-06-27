<?php

namespace App\Http\Controllers;

use App\Actions\CreateClientAction;
use App\Actions\DeleteClientAction;
use App\Actions\UpdateClientAction;
use App\DTOs\ClientData;
use App\Enums\ClientStatus;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use App\Services\ClientService;
use App\Support\ClientResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function __construct(
        private readonly ClientService $clientService,
        private readonly CreateClientAction $createClientAction,
        private readonly UpdateClientAction $updateClientAction,
        private readonly DeleteClientAction $deleteClientAction,
    ) {}

    public function index(): Response
    {
        $clients = $this->clientService->paginate();

        return Inertia::render('Clients/Index', [
            'clients' => [
                'data' => ClientResource::collection($clients->items()),
                'links' => $clients->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $clients->currentPage(),
                    'last_page' => $clients->lastPage(),
                    'per_page' => $clients->perPage(),
                    'total' => $clients->total(),
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Clients/Create', [
            'statuses' => ClientStatus::values(),
        ]);
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $this->createClientAction->execute(
            ClientData::fromArray($request->validated()),
        );

        return redirect()
            ->route('clients.index')
            ->with('success', 'Client created successfully.');
    }

    public function show(Client $client): Response
    {
        return Inertia::render('Clients/Show', [
            'client' => ClientResource::make($client),
        ]);
    }

    public function edit(Client $client): Response
    {
        return Inertia::render('Clients/Edit', [
            'client' => ClientResource::make($client),
            'statuses' => ClientStatus::values(),
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $this->updateClientAction->execute(
            $client,
            ClientData::fromArray($request->validated()),
        );

        return redirect()
            ->route('clients.index')
            ->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        $this->deleteClientAction->execute($client);

        return redirect()
            ->route('clients.index')
            ->with('success', 'Client deleted successfully.');
    }
}
