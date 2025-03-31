<?php

namespace App\Enums;

enum VendorStatusEnum: string
{
    case Pending = 'PENDING';
    case Rejected = 'REJECTED';
    case Approved = 'APPROVED';

    public static function labels(): array{
        return [
            self::Pending->value => __('Pending'),
            self::Rejected->value => __('Rejected'),
            self::Approved->value => __('Approved'),
        ];
    }

    public static function colors(): array{
        return [
            'warning' => self::Pending->value,
            'danger' => self::Rejected->value,
            'success' => self::Approved->value,
        ];
    }
}
