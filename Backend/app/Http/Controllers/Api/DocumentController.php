<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Chunk;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Storage;
use App\Services\EmbeddingService;
use Illuminate\Support\Facades\Http;

class DocumentController extends Controller
{
    public function uploadPdf(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:10240']
        ]);

        $file = $request->file('file');

        // 1. حفظ الملف
        $path = $file->store('pdfs', 'public');

        // 2. استخراج النص
        $parser = new Parser();
        $pdf = $parser->parseFile(storage_path("app/public/" . $path));
        $text = $pdf->getText();

        // 3. Chunking
        $chunks = $this->chunkText($text);

        foreach ($chunks as $chunk) {

            if (trim($chunk['content']) === '') {
                continue;
            }

            Chunk::create([
                'content' => $chunk['content'],
                'chunk_index' => $chunk['chunk_index']
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'PDF processed successfully',
            'chunks_count' => count($chunks)
        ]);
    }

    private function chunkText(string $text, int $size = 800): array
    {
        $text = preg_replace('/\s+/', ' ', $text); // تنظيف

        $chunks = [];
        $length = strlen($text);

        $index = 0;

        for ($i = 0; $i < $length; $i += $size) {

            $chunk = substr($text, $i, $size);

            $chunks[] = [
                'content' => $chunk,
                'chunk_index' => $index
            ];

            $index++;
        }

        return $chunks;
    }

    public function indexChunks(EmbeddingService $embeddingService)
    {
        $chunks = Chunk::all();

        $chunks->chunk(5)->each(function ($chunkBatch) use ($embeddingService) {

            $texts = $chunkBatch->pluck('content')->toArray();
            $vectors = $embeddingService->embedTexts($texts);

            $points = [];

            // ✅ استخدم values() عشان تعيد ترقيم الـ index من 0
            $chunkList = $chunkBatch->values();

            foreach ($chunkList as $index => $chunk) {

                if (!isset($vectors[$index])) {
                    continue;
                }

                $points[] = [
                    'id'     => $chunk->id,
                    'vector' => $vectors[$index],
                    'payload' => [
                        'content'     => mb_substr($chunk->content, 0, 500),
                        'chunk_index' => $chunk->chunk_index,
                    ]
                ];
            }

            // ✅ تحقق إن points مش فاضية قبل الإرسال
            if (empty($points)) {
                \Log::warning('No points to index in this batch');
                return;
            }

            $qdrantResponse = Http::put(
                'http://localhost:6333/collections/chunks/points',
                ['points' => $points]
            );

            if ($qdrantResponse->failed()) {
                throw new \Exception('Qdrant failed: ' . $qdrantResponse->body());
            }
        });

        return response()->json(['message' => 'Indexing completed']);
    }
}
