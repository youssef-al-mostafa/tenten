<?php

namespace App\Enums;

enum VendorStatusEnum: string
{
    case Pending = 'PENDING';
    case Approved = 'APPROVED';
    case Rejected = 'REJECTED';
}
