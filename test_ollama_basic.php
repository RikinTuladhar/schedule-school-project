<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

try {
    echo "Prompting Ollama api/chat directly...\n";
    $response = Http::post('http://localhost:11434/api/chat', [
        'model' => 'gemma:2b',
        'messages' => [['role' => 'user', 'content' => 'Write a one-sentence greeting.']],
        'stream' => false
    ]);
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
