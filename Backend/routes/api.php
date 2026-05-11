<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DocumentController;
// Public routes for Auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::get('/chats', [ChatController::class, 'DisplayChats']);
    Route::post('/chats/{id}/messages', [ChatController::class, 'sendMessage']);
    Route::get('/chats/{id}/messages', [ChatController::class, 'getMessages']);
    Route::post('/chats', [ChatController::class, 'createNewChat']);
    Route::post('/upload-pdf', [DocumentController::class, 'uploadPdf']);
    Route::post('/index-chunks', [DocumentController::class, 'indexChunks']);
});
