<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $tasks = Task::where('user_id', Auth::id())
            ->with('project')
            ->latest()
            ->paginate(15);

        $projects = \App\Models\Project::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $projects = \App\Models\Project::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return Inertia::render('tasks/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        Task::create([
            'user_id' => Auth::id(),
            ...$request->validated(),
        ]);

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task): Response
    {
        $this->authorize('view', $task);

        return Inertia::render('tasks/show', [
            'task' => $task->load('project'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task): Response
    {
        $this->authorize('update', $task);

        $projects = \App\Models\Project::where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return Inertia::render('tasks/edit', [
            'task' => $task,
            'projects' => $projects,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }

    /**
     * Get task data as JSON (for modals/API)
     */
    public function apiShow(Task $task): \Illuminate\Http\JsonResponse
    {
        $this->authorize('view', $task);

        return response()->json(
            $task->load('project')
        );
    }
}
