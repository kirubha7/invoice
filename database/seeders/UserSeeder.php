<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'kirubhadarkdevil@gmail.com'],
            [
                'name' => 'Kirubha',
                'password' => Hash::make('Kirubha#7'),
                'email_verified_at' => now(),
            ]
        );
    }
}
