<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('projects', ProjectController::class);
    Route::get('api/projects/{project}', [ProjectController::class, 'apiShow'])->name('api.projects.show');
    Route::resource('tasks', TaskController::class);
    Route::get('api/tasks/{task}', [TaskController::class, 'apiShow'])->name('api.tasks.show');
    Route::resource('customers', CustomerController::class);
    Route::get('api/customers/{customer}', [CustomerController::class, 'apiShow'])->name('api.customers.show');
    Route::resource('invoices', InvoiceController::class);
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'pdf'])->name('invoices.pdf');
    
    // Payment routes
    Route::post('invoices/{invoice}/payments', [\App\Http\Controllers\PaymentController::class, 'store'])->name('invoices.payments.store');
    Route::delete('invoices/{invoice}/payments/{payment}', [\App\Http\Controllers\PaymentController::class, 'destroy'])->name('invoices.payments.destroy');
    
    // API routes for invoice form
    Route::get('api/projects/{project}/tasks', function (\App\Models\Project $project) {
        if ($project->user_id !== auth()->id()) {
            abort(403);
        }
        return response()->json(
            $project->tasks()->where('user_id', auth()->id())->get()
        );
    })->name('api.projects.tasks');
});

require __DIR__.'/settings.php';
