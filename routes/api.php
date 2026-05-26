<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\ClientAuthController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::controller(AdminAuthController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/admin/profile', 'profile');
        Route::get('/admin/logout', 'logout');
    });
    Route::post('/admin/login', 'login');
    Route::post('/admin/register', 'register');
});

Route::controller(ClientAuthController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/client/profile', 'profile');
        Route::post('/client/logout', 'logout');
    });

    Route::post('/client/login', 'login');
});
