<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'created_by',
        'updated_by'
    ];
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

}
