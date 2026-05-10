<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EmbeddingService
{
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.hugging.api_key');
    }

    public function embedTexts(array $texts): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type'  => 'application/json',
        ])->post(
            'https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5',
            [
                'inputs' => $texts
            ]
        );

        if ($response->failed()) {
            throw new \Exception(
                'HF ERROR: ' . $response->body()
            );
        }

        $data = $response->json();

        // إذا رجع vector واحد
        if (isset($data[0]) && is_float($data[0])) {
            return [$data];
        }

        return $data;
    }

    public function searchSimilar(array $queryVector, int $limit = 3): array
    {
        $response = Http::post('http://localhost:6333/collections/chunks/points/search', [
            'vector' => $queryVector,
            'limit'  => $limit,
            'with_payload' => true,
        ]);

        if ($response->failed()) {
            throw new \Exception('Qdrant search failed: ' . $response->body());
        }

        return $response->json()['result'] ?? [];
    }
}
