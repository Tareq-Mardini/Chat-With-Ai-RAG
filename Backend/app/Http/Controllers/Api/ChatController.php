<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\OpenRouterService;
use App\Models\Chat;
use App\Http\Requests\Chat\StoreChatRequest;
use App\Http\Controllers\Controller;

class ChatController extends Controller
{

    public function DisplayChats(Request $request)
    {
        $user = $request->user();
        $chats = $user->chats;
        $ResponseChats = $chats->map(function ($chat) {
            return [
                'id' => $chat->id,
                'title' => $chat->title,
            ];
        });

        return response()->json([
            'chats' => $ResponseChats
        ], 200);
    }

    public function getMessages(Request $request, $id)
    {
        $user = $request->user();

        $chat = $user->chats()->where('id', $id)->first();

        if (!$chat) {
            return response()->json([
                'error' => 'Chat not found'
            ], 404);
        }

        $messages = $chat->messages;
        $responseMessage = $messages->map(function ($mes) {
            return [
                'role' => $mes->role,
                'content' => $mes->content,
                'image_path' => $mes->role,
            ];
        });
        return response()->json([
            'messages' => $responseMessage
        ], 200);
    }

    public function createNewChat(StoreChatRequest $request): JsonResponse
    {
        $user = $request->user();
        $chat = Chat::create([
            'title'   => $request->title,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'chat' => $chat,
        ], 201);
    }

    public function sendMessage(Request $request, OpenRouterService $service, $id): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:10000'],
            'image'   => ['nullable', 'image', 'max:5120']
        ]);

        $result = $service->handleMessage(
            $request->user(),
            $id,
            $validated['message'],
            $request->file('image')
        );
        return response()->json($result, $result['status'] ?? 200);
    }
}
