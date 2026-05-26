<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
    })

    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (
            AuthenticationException $e,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status'  => false,
                    'message' => $e->getMessage(),
                ], 401);
            }
        });

        $exceptions->render(function (
            NotFoundHttpException $e,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status'  => false,
                    'message' => $e->getMessage() ?: 'Resource not found.',
                ], 404);
            }
        });

        $exceptions->render(function (
            AuthorizationException $e,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status'  => false,
                    'message' => $e->getMessage() ?: 'This action is unauthorized.',
                ], 403);
            }
        });

        $exceptions->render(function (
            QueryException $e,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {

                if ($e->getCode() == 23000) {
                    return response()->json([
                        'status'  => false,
                        'message' => 'This record already exists.',
                    ], 422);
                }

                if ($e->getCode() == 1452) {
                    return response()->json([
                        'status'  => false,
                        'message' => 'Referenced record does not exist.',
                    ], 422);
                }

                Log::error('Database error: ' . $e->getMessage());

                return response()->json([
                    'status'  => false,
                    'message' => 'A database error occurred. Please try again.',
                ], 500);
            }
        });

    })
    ->create();
