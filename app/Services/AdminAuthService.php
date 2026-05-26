<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminAuthService
{
    public function __construct(
        private readonly AdminService $admins,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function register(array $data): Admin
    {
        return $this->admins->create($data);
    }

    public function login(string $identifier, string $password): ?string
    {
        $admin = Admin::query()
            ->where(function ($query) use ($identifier): void {
                $query
                    ->where('email', $identifier)
                    ->orWhere('username', $identifier);
            })
            ->first();

        if (! $admin || ! Hash::check($password, $admin->password)) {
            return null;
        }

        return $admin->createToken('admin-token')->plainTextToken;
    }
}
