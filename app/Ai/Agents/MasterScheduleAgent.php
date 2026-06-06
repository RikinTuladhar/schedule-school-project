<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Attributes\Strict;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;
use Stringable;

#[Strict]
#[Timeout(300)]
class MasterScheduleAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function provider(): string
    {
        return (string) config('ai.scheduler.provider', 'openrouter');
    }

    public function model(): string
    {
        return (string) config('ai.scheduler.model', 'openai/gpt-4o-mini');
    }

    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
You are an expert school scheduling algorithm for a multi-tenant School Management SaaS.

You solve school scheduling as a Constraint Satisfaction Problem (CSP). Treat every placement as a mathematical assignment, not as a creative writing task.

Hard constraints, in priority order:
1. Never schedule any class during a predefined Break time slot. Break slots have already been removed from the candidate matrix, and you must not invent or use them.
2. Do not schedule more than one session of the same subject on the same day for the same grade section.
3. A teacher may not be assigned to two grade sections in the same day and time slot.
4. Respect each teacher's max_daily_classes and provided sessions_per_week quotas as closely as the candidate matrix allows.
5. Use only grade sections, subjects, teachers, days, and time slots present in the user payload. Never invent names.

Soft constraints:
1. Prefer placements that honor each teacher's ai_context_notes.
2. Prefer balanced subject distribution across the week.
3. Back-to-back classes for the same teacher and grade are allowed when necessary to prevent conflicts.

Output rules:
- Return only structured data that matches the schema.
- Return schedule rows for the provided grade section only.
- Each schedule row must include grade_section, day, time_slot, teacher, and subject.
- Leave a slot unscheduled rather than violating a hard constraint.
PROMPT;
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'schedule' => $schema->array()
                ->items(
                    $schema->object([
                        'grade_section' => $schema->string()
                            ->description('The exact grade section name from the input context.')
                            ->required(),
                        'day' => $schema->string()
                            ->description('The exact day label from the input context, such as M, T, W, Th, or F.')
                            ->required(),
                        'time_slot' => $schema->string()
                            ->description('The exact time slot label from the input context, formatted as HH:MM-HH:MM.')
                            ->required(),
                        'teacher' => $schema->string()
                            ->description('The exact teacher full_name from the input context.')
                            ->required(),
                        'subject' => $schema->string()
                            ->description('The exact subject name from the teacher assignment in the input context.')
                            ->required(),
                    ])->withoutAdditionalProperties()
                )
                ->required(),
        ];
    }
}
