<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get unread notifications for the user.
     */
    public function index()
    {
        return response()->json([
            'notifications' => Auth::user()->unreadNotifications,
            'count' => Auth::user()->unreadNotifications->count()
        ]);
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
        
        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead($id)
    {
        Auth::user()->unreadNotifications->where('id', $id)->markAsRead();
        
        return response()->json(['message' => 'Notification marked as read']);
    }
}
