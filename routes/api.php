<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\GradeManagementController;
use App\Http\Controllers\Api\ScheduleTemplateController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherController;
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
        Route::apiResource('subjects', SubjectController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('schedule-templates', ScheduleTemplateController::class);
    });

    Route::post('/client/login', 'login');
});

Route::middleware('auth:sanctum')->controller(GradeManagementController::class)->group(function () {
    Route::get('/grade-data', 'index');

    Route::post('/grades', 'storeGrade');
    Route::put('/grades/{grade}', 'updateGrade');
    Route::delete('/grades/{grade}', 'destroyGrade');

    Route::post('/sections', 'storeSection');
    Route::put('/sections/{section}', 'updateSection');
    Route::delete('/sections/{section}', 'destroySection');

    Route::post('/grade-sections', 'storeGradeSection');
    Route::put('/grade-sections/{gradeSection}', 'updateGradeSection');
    Route::delete('/grade-sections/{gradeSection}', 'destroyGradeSection');
});
