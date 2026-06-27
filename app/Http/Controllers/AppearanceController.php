<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AppearanceController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'appearance' => ['required', 'in:light,dark,system'],
        ]);

        return back()->cookie(
            'appearance',
            $validated['appearance'],
            60 * 24 * 365,
        );
    }
}
