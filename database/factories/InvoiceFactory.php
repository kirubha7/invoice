<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 100, 10000);
        $tax = $subtotal * 0.1;
        $total = $subtotal + $tax;

        return [
            'user_id' => User::factory(),
            'invoice_number' => 'INV-'.fake()->unique()->numerify('#######'),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_address' => fake()->address(),
            'invoice_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'due_date' => fake()->dateTimeBetween('now', '+30 days'),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'status' => fake()->randomElement(['draft', 'sent', 'paid', 'overdue']),
            'notes' => fake()->optional()->sentence(),
            'items' => [
                [
                    'description' => fake()->sentence(),
                    'quantity' => fake()->numberBetween(1, 10),
                    'price' => fake()->randomFloat(2, 10, 1000),
                ],
                [
                    'description' => fake()->sentence(),
                    'quantity' => fake()->numberBetween(1, 10),
                    'price' => fake()->randomFloat(2, 10, 1000),
                ],
            ],
        ];
    }
}
