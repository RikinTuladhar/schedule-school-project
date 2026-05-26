<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Arr;

class AdminService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Admin
    {
        return Admin::create(Arr::only($data, [
            'username',
            'email',
            'password',
            'full_name',
        ]));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Admin $admin, array $data): Admin
    {
        $admin->fill(Arr::only($data, [
            'username',
            'email',
            'password',
            'full_name',
        ]));

        $admin->save();

        return $admin;
    }
}
