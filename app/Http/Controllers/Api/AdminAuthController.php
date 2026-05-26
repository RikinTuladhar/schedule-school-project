<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\Admin;
use App\Services\AdminAuthService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class AdminAuthController extends BaseController
{
    public function __construct(
        private readonly AdminAuthService $authService,
    ) {}

    public function register(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:admins,username'],
            'email' => ['required', 'email', 'max:255', 'unique:admins,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'full_name' => ['required', 'string', 'max:255'],
        ]);

        $admin = $this->authService->register($data);

        return $this->sendResponse('Admin registered successfully', [
            'admin' => $admin,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'login' => ['nullable', 'string', 'required_without_all:email,username'],
            'email' => ['nullable', 'email', 'required_without_all:login,username'],
            'username' => ['nullable', 'string', 'required_without_all:login,email'],
            'password' => ['required', 'string'],
        ]);

        $token = $this->authService->login(
            $data['login'] ?? $data['email'] ?? $data['username'],
            $data['password'],
        );

        if (! $token) {
            return $this->sendErrorResponse('Invalid credentials', [], 401);
        }

        return $this->sendResponse('Login successful', [
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return $this->sendResponse('Logged out');
    }

    public function profile(Request $request)
    {
        /** @var Admin $admin */
        $admin = $request->user();

        return $this->sendResponse('Profile', [
            'admin' => $admin,
        ]);
    }
}
