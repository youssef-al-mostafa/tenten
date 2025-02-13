<?php

namespace App\Enums\Enums;

enum ProductStutesEnum: string
{
    case Draft = 'draft';
    case Published = 'published';

    public function label():array
    {
          return [
              self::Draft->value => __('Draft'),
              self::Published->value => __('Published'),
          ];
    }
    public function colors(): array{
        return [
            'gray' => self::Draft->value ,
            'success' => self::Published->value,
        ];
    }
}
