<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            // ربط مع المحادثة
            $table->foreignId('chat_id')->constrained()->cascadeOnDelete();

            // نوع الرسالة
            $table->enum('role', ['user', 'assistant', 'system']);

            // النص
            $table->text('content');

            // صورة (اختياري)
            $table->string('image_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
