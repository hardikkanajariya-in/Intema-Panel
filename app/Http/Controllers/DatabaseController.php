<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DatabaseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Databases/Index');
    }
}
