<?php

namespace App\Mail;

use App\Models\NewsletterCampaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterCampaignMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public NewsletterCampaign $campaign,
        public string $recipientEmail = ''
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('noreply@ten-ten.live', 'Tenten'),
            replyTo: [new Address('youssefalmostafa22331@gmail.com', 'Tenten Support')],
            subject: $this->campaign->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.newsletter-campaign',
            with: [
                'campaign' => $this->campaign,
                'recipientEmail' => $this->recipientEmail,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
