<?php

namespace App\Enums;

enum RolesEnum: string
{
    case CLIENT = 'client';
    case VENDOR = 'vendor';
    case ADMIN = 'admin';
    case MASTER_ADMIN = 'master_admin';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}