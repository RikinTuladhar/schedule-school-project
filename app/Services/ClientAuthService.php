<?php

namespace App\Services;

use App\Models\Client;
use Illuminate\Support\Facades\Hash;

class ClientAuthService
{
    public function authenticate(string $identifier, string $password): ?Client
    {
        $client = Client::query()
            ->where(function ($query) use ($identifier): void {
                $query
                    ->where('email', $identifier)
                    ->orWhere('username', $identifier);
            })
            ->first();

        if (! $client || ! Hash::check($password, $client->password)) {
            return null;
        }

        return $client;
    }

    public function createToken(Client $client): string
    {
        return $client->createToken('client-token')->plainTextToken;
    }
}
