<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SystemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('System/Index');
    }
}
