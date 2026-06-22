<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\MasterScheduleRun;
use App\Models\MasterScheduleEntry;

$latestRun = MasterScheduleRun::latest()->first();
if (!$latestRun) {
    die("No run found\n");
}

echo "DOUBLE BOOKED TEACHERS:\n";
$entries = MasterScheduleEntry::where('master_schedule_run_id', $latestRun->id)->get();

$grouped = [];
foreach ($entries as $e) {
    if ($e->teacher === 'Club Sir' || $e->teacher === 'Game Sir' || $e->teacher === 'Dance Mam' || $e->teacher === 'Chinese Mam') {
        continue; // ignore common/special teachers
    }
    $key = "{$e->day} | {$e->time_slot} | {$e->teacher}";
    $grouped[$key][] = $e;
}

foreach ($grouped as $key => $list) {
    if (count($list) > 1) {
        echo "Key: $key\n";
        foreach ($list as $e) {
            echo "  Class: {$e->grade_section}, Subject: {$e->subject}\n";
        }
    }
}
