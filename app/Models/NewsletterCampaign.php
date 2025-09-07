<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterCampaign extends Model
{
    protected $fillable = [
        'title',
        'content',
        'campaign_type',
        'recipient_count',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];
}
