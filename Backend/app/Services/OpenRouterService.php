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

    public function __construct(private EmbeddingService $embeddingService)
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

            $systemPrompt = null;
            try {
                // حول السؤال لـ embedding
                $queryVectors = $this->embeddingService->embedTexts([$message]);
                $queryVector  = $queryVectors[0];

                // ابحث في Qdrant
                $similarChunks = $this->embeddingService->searchSimilar($queryVector, limit: 3);

                if (!empty($similarChunks)) {
                    $context = collect($similarChunks)
                        ->pluck('payload.content')
                        ->filter()
                        ->implode("\n\n---\n\n");

                    $systemPrompt = "You are a helpful assistant. Answer based on the following context:\n\n{$context}\n\nIf the answer is not in the context, say you don't know.";
                }
            } catch (\Throwable $e) {
                Log::warning('RAG failed, continuing without context: ' . $e->getMessage());
            }

            // ✅ 6. إرسال للـ AI
            $payload = [
                'model'    => $this->model,
                'messages' => $messages,
            ];

            // أضف system prompt إذا عندنا context
            if ($systemPrompt) {
                array_unshift($payload['messages'], [
                    'role'    => 'system',
                    'content' => $systemPrompt,
                ]);
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type'  => 'application/json',
            ])->post($this->apiUrl, $payload);

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
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
                'status'  => 500
            ];
        }
    }
}
