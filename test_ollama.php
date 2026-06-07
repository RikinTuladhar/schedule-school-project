<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $agent = new App\Ai\Agents\MasterScheduleAgent();
    echo "Prompting MasterScheduleAgent...\n";
    $res = $agent->prompt('Write a one-sentence greeting.');
    echo "Response:\n";
    echo $res . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
