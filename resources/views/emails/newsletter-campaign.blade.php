@component('mail::message')

{{-- Campaign Type Badge --}}
<div style="text-align: center; margin-bottom: 20px;">
    <span style="display: inline-block; background-color: {{ 
        match($campaign->campaign_type) {
            'sale' => '#10B981',
            'announcement' => '#F59E0B', 
            'newsletter' => '#3B82F6',
            default => '#6B7280'
        }
    }}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
        {{ ucfirst($campaign->campaign_type) }}
    </span>
</div>

# {{ $campaign->title }}

{!! nl2br(e($campaign->content)) !!}

@if($campaign->campaign_type === 'sale')
@component('mail::button', ['url' => config('app.url')])
🛒 Shop Now
@endcomponent
@endif

Thanks,<br>
{{ config('app.name') }} Team

@endcomponent
