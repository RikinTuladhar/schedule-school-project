<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends BaseController
{
    public function login(Request $request)
    {
        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return $this->sendErrorResponse('Invalid credentials', [], 401);
        }

        return $this->sendResponse('Login successful', [
            'token' => $admin->createToken('admin-token')->plainTextToken
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->sendResponse('Logged out');
    }

    public function profile(Request $request)
    {
        return $this->sendResponse('Profile', $request->user());
    }
}
