<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\Client;
use App\Services\ClientAuthService;
use Illuminate\Http\Request;

class ClientAuthController extends BaseController
{
    public function __construct(
        private readonly ClientAuthService $authService,
    ) {}

    public function login(Request $request)
    {
        $data = $request->validate([
            'login' => ['nullable', 'string', 'required_without_all:email,username'],
            'email' => ['nullable', 'email', 'required_without_all:login,username'],
            'username' => ['nullable', 'string', 'required_without_all:login,email'],
            'password' => ['required', 'string'],
        ]);

        $client = $this->authService->authenticate(
            $data['login'] ?? $data['email'] ?? $data['username'],
            $data['password'],
        );

        if (! $client) {
            return $this->sendErrorResponse('Invalid credentials', [], 401);
        }

        if (! $client->is_active) {
            return $this->sendErrorResponse('Client account is inactive.', [], 403);
        }

        return $this->sendResponse('Login successful', [
            'token' => $this->authService->createToken($client),
            'client' => $client,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return $this->sendResponse('Logged out');
    }

    public function profile(Request $request)
    {
        /** @var Client $client */
        $client = $request->user();

        return $this->sendResponse('Profile', [
            'client' => $client,
        ]);
    }
}
