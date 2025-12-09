<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        $userId = Auth::id();

        $stats = [
            'projects' => Project::where('user_id', $userId)->count(),
            'tasks' => Task::where('user_id', $userId)->count(),
            'customers' => Customer::where('user_id', $userId)->count(),
            'invoices' => Invoice::where('user_id', $userId)->count(),
            'total_revenue' => Invoice::where('user_id', $userId)->sum('total'),
            'pending_invoices' => Invoice::where('user_id', $userId)
                ->where('status', '!=', 'paid')
                ->count(),
            'paid_invoices' => Invoice::where('user_id', $userId)
                ->where('status', 'paid')
                ->count(),
        ];

        $recentInvoices = Invoice::where('user_id', $userId)
            ->with('customer')
            ->latest()
            ->limit(5)
            ->get();

        $recentProjects = Project::where('user_id', $userId)
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentInvoices' => $recentInvoices,
            'recentProjects' => $recentProjects,
        ]);
    }
}
