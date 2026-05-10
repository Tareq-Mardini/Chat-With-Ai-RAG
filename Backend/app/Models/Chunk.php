<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chunk extends Model
{
    protected $table = 'chunks';

    public $timestamps = false;

    protected $fillable = [
        'content',
        'chunk_index',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}