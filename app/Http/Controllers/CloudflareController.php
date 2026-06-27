<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class CloudflareController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Cloudflare/Index');
    }
}
