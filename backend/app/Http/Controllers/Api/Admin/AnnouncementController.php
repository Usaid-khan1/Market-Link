<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Display announcements visible to all users (customers, farmers, admin).
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $query = Announcement::with('author')->where('is_active', true);

        if ($request->filled('audience')) {
            $audience = $request->query('audience');
            $query->where(function ($q) use ($audience) {
                $q->where('audience', 'All Community')
                    ->orWhere('audience', $audience);
            });
        }

        $announcements = $query->latest()->get();

        return $this->success(AnnouncementResource::collection($announcements), 'Announcements retrieved successfully');
    }

    /**
     * Display all announcements for Admin management.
     */
    public function index(): JsonResponse
    {
        $announcements = Announcement::with('author')->latest()->get();

        return $this->success(AnnouncementResource::collection($announcements), 'All announcements retrieved successfully');
    }

    /**
     * Store a newly created announcement.
     */
    public function store(AnnouncementRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        $announcement = Announcement::create($validated);
        $announcement->load('author');

        return $this->success(new AnnouncementResource($announcement), 'Announcement published successfully', 201);
    }

    /**
     * Display the specified announcement.
     */
    public function show(Announcement $announcement): JsonResponse
    {
        $announcement->load('author');

        return $this->success(new AnnouncementResource($announcement), 'Announcement details retrieved successfully');
    }

    /**
     * Update the specified announcement.
     */
    public function update(AnnouncementRequest $request, Announcement $announcement): JsonResponse
    {
        $announcement->update($request->validated());
        $announcement->load('author');

        return $this->success(new AnnouncementResource($announcement), 'Announcement updated successfully');
    }

    /**
     * Remove the specified announcement.
     */
    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();

        return $this->success(null, 'Announcement deleted successfully');
    }
}
