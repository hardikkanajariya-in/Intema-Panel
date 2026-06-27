<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SslController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('SSL/Index');
    }
}
