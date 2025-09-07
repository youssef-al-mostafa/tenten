<?php

namespace App\Filament\Resources\NewsletterCampaignResource\Pages;

use App\Enums\RolesEnum;
use App\Filament\Resources\NewsletterCampaignResource;
use App\Mail\NewsletterCampaignMail;
use App\Models\Newsletter;
use App\Models\User;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Mail;

class CreateNewsletterCampaign extends CreateRecord
{
    protected static string $resource = NewsletterCampaignResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $recipientCount = NewsletterCampaignResource::calculateRecipientCount($data['recipient_types']);
        
        $data['recipient_count'] = $recipientCount;
        $data['sent_at'] = now();

        return $data;
    }

    protected function afterCreate(): void
    {
        $this->sendEmailsToRecipients();
    }

    private function sendEmailsToRecipients(): void
    {
        $recipientTypes = $this->record->recipient_types;
        $emails = collect();

        foreach ($recipientTypes as $type) {
            switch ($type) {
                case 'all':
                    $userEmails = User::pluck('email');
                    $subscriberEmails = Newsletter::where('status', 'active')->pluck('email');
                    $emails = $userEmails->concat($subscriberEmails);
                    break 2;
                case 'customers':
                    $emails = $emails->concat(
                        User::whereHas('roles', function ($query) {
                            $query->where('name', RolesEnum::CUSTOMER->value);
                        })->pluck('email')
                    );
                    break;
                case 'vendors':
                    $emails = $emails->concat(
                        User::whereHas('roles', function ($query) {
                            $query->where('name', RolesEnum::VENDOR->value);
                        })->pluck('email')
                    );
                    break;
                case 'admins':
                    $emails = $emails->concat(
                        User::whereHas('roles', function ($query) {
                            $query->whereIn('name', [RolesEnum::ADMIN->value, RolesEnum::MASTER_ADMIN->value]);
                        })->pluck('email')
                    );
                    break;
                case 'subscribers':
                    $emails = $emails->concat(
                        Newsletter::where('status', 'active')->pluck('email')
                    );
                    break;
            }
        }

        $uniqueEmails = $emails->unique();

        foreach ($uniqueEmails as $email) {
            Mail::to($email)->queue(new NewsletterCampaignMail($this->record, $email));
        }
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Email Campaign Sent!')
            ->body('Email sent to ' . $this->record->recipient_count . ' recipients successfully.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
