<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::controller(AdminAuthController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/admin/profile', 'profile');
        Route::get('/admin/logout',  'logout');
    });
    Route::post('/admin/login',  'login');
    Route::post('/admin/register',  'register');
});

Route::controller(CategoryController::class)->group(function () {
    Route::get('/categories', 'index');
    Route::post('/categories', 'store');
    Route::get('/categories/{id}', 'show');
    Route::put('/categories/{id}', 'update');
    Route::delete('/categories/{id}', 'destroy');
});