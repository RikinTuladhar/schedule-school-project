<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('languages')->insert([
            [
                'language_id' => 1,
                'name' => 'English',
                'code' => 'en',
                'locale' => 'en_US',
                'image' => 'gb.png',
                'directory' => 'english',
                'sort_order' => 1,
                'status' => 1,
            ],
            [
                'language_id' => 2,
                'name' => 'Nepali',
                'code' => 'ne',
                'locale' => 'ne_NP',
                'image' => 'np.png',
                'directory' => 'nepali',
                'sort_order' => 2,
                'status' => 1,
            ],
        ]);
    }
}
