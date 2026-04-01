<?php

namespace App\Services;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenRouterService
{
    private string $apiKey;
    private string $apiUrl;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->apiUrl = config('services.openrouter.url');
        $this->model  = config('services.openrouter.model');
    }


    public function handleMessage($user, int $chatId, string $message, ?UploadedFile $image = null): array
    {
        try {
            // ✅ 1. تأكد من chat
            $chat = Chat::where('id', $chatId)
                ->where('user_id', $user->id)
                ->first();

            if (!$chat) {
                return [
                    'success' => false,
                    'message' => 'Chat not found',
                    'status'  => 404,
                ];
            }

            // ✅ 2. تخزين الصورة
            $imagePath = null;

            if ($image) {
                $imagePath = $image->store('chat-images', 'public');
            }

            // ✅ 3. حفظ رسالة المستخدم
            $userMessage = $chat->messages()->create([
                'role'       => 'user',
                'content'    => $message,
                'image_path' => $imagePath,
            ]);

            // ✅ 4. جلب history
            $history = $chat->messages()
                ->latest()     // ترتيب تنازلي
                ->take(3)      // آخر 5 فقط
                ->get()
                ->reverse();

            // ✅ 5. تجهيز الرسائل للـ AI
            $messages = $history->map(function ($msg) {
                return [
                    'role' => $msg->role,
                    'content' => $msg->content, // نص مباشر فقط
                ];
            })->values()->toArray();

            // // إذا يوجد صورة أضف رابطها للنص الأخير
            // if ($image) {
            //     $imageData = base64_encode(file_get_contents($image->getRealPath()));
            //     $mimeType = $image->getMimeType();

            //     $base64Image = "data:$mimeType;base64,$imageData";

            //     $messages[count($messages) - 1]['content'] .= "\n[Image: $base64Image]";
            // }
            // ✅ 6. إرسال للـ AI
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type'  => 'application/json',
            ])->post($this->apiUrl, [
                'model'    => $this->model,
                'messages' => $messages,
            ]);

            if ($response->failed()) {
                return [
                    'success' => false,
                    'message' => 'API Error',
                    'error'   => $response->body(), // 🔥 مهم
                    'status'  => $response->status()
                ];
            }

            $data = $response->json();

            $reply = $data['choices'][0]['message']['content'] ?? null;

            if (!$reply) {
                return [
                    'success' => false,
                    'message' => 'No reply from AI',
                    'status'  => 500
                ];
            }

            // ✅ 7. حفظ رد AI
            $aiMessage = $chat->messages()->create([
                'role'    => 'assistant',
                'content' => $reply,
            ]);

            return [
                'success' => true,
                'reply'   => $reply,
                'user_message' => $userMessage,
                'ai_message'   => $aiMessage,
                'status'  => 200
            ];
        } catch (\Throwable $e) {



            return [
                'success' => false,
                'message' => 'Server error',
                'status'  => 500
            ];
        }
    }
}
