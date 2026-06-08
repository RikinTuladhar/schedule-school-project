<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Grade;
use App\Models\GradeSection;
use App\Models\MasterScheduleEntry;
use App\Models\MasterScheduleRun;
use App\Models\ScheduleTemplate;
use App\Models\Section;
use App\Models\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MasterScheduleToggleFixedTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_toggle_is_fixed_metadata_on_schedule_entry(): void
    {
        // 1. Setup School
        $school = School::create([
            'name' => 'Test School',
            'code' => 'TEST',
            'email' => 'test@school.com',
            'is_active' => true,
        ]);

        // 2. Setup Client user
        $client = Client::create([
            'school_id' => $school->id,
            'username' => 'testclient',
            'email' => 'client@test.com',
            'password' => bcrypt('password'),
            'full_name' => 'Test Client',
            'is_active' => true,
        ]);

        // 3. Setup Grade, Section, ScheduleTemplate, GradeSection
        $grade = Grade::create([
            'school_id' => $school->id,
            'name' => 'Grade 6',
        ]);

        $section = Section::create([
            'school_id' => $school->id,
            'name' => 'A',
        ]);

        $template = ScheduleTemplate::create([
            'school_id' => $school->id,
            'name' => 'Six To Ten',
            'level' => 'secondary',
            'start_time' => '10:00',
            'end_time' => '16:00',
            'grade_ids' => [$grade->id],
            'days' => ['monday', 'tuesday'],
            'periods' => [
                [
                    'id' => 'p1',
                    'name' => 'Period 1',
                    'start_time' => '10:00',
                    'end_time' => '10:45',
                    'type' => 'academic',
                ]
            ],
        ]);

        $gradeSection = GradeSection::create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'section_id' => $section->id,
            'schedule_template_id' => $template->id,
        ]);

        // 4. Setup MasterScheduleRun
        $run = MasterScheduleRun::create([
            'school_id' => $school->id,
            'status' => 'completed',
        ]);

        // 5. Setup MasterScheduleEntry
        $entry = MasterScheduleEntry::create([
            'master_schedule_run_id' => $run->id,
            'school_id' => $school->id,
            'grade_section_id' => $gradeSection->id,
            'grade_section' => 'Grade 6',
            'day' => 'monday',
            'time_slot' => 'slot1',
            'teacher' => 'John Doe',
            'subject' => 'Math',
            'metadata' => ['is_fixed' => false],
        ]);

        // Authenticate with Sanctum
        Sanctum::actingAs($client);

        // Toggle to true
        $response = $this->patchJson("/api/master-schedules/entries/{$entry->id}/toggle-fixed");
        $response->assertStatus(200);
        $response->assertJsonPath('data.entry.metadata.is_fixed', true);

        $entry->refresh();
        $this->assertTrue($entry->metadata['is_fixed'] ?? false);

        // Toggle back to false
        $response2 = $this->patchJson("/api/master-schedules/entries/{$entry->id}/toggle-fixed");
        $response2->assertStatus(200);
        $response2->assertJsonPath('data.entry.metadata.is_fixed', false);

        $entry->refresh();
        $this->assertFalse($entry->metadata['is_fixed'] ?? true);
    }
}
