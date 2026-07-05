<?php

namespace App\Enums;

enum ApplicationType: string
{
    case StaticWebsite = 'static_website';
    case Laravel = 'laravel';
    case StandardPhp = 'standard_php';
    case NextJs = 'nextjs';
    case NestJs = 'nestjs';
    case ApiOnly = 'api_only';
    case Custom = 'custom';

    public function label(): string
    {
        return match ($this) {
            self::StaticWebsite => 'Static Website',
            self::Laravel => 'Laravel',
            self::StandardPhp => 'Standard PHP',
            self::NextJs => 'Next.js',
            self::NestJs => 'NestJS',
            self::ApiOnly => 'API Only',
            self::Custom => 'Custom',
        };
    }

    /**
     * @return list<self>
     */
    public static function provisionable(): array
    {
        return [
            self::StaticWebsite,
            self::Laravel,
            self::StandardPhp,
            self::NextJs,
            self::NestJs,
            self::ApiOnly,
            self::Custom,
        ];
    }

    /**
     * @return list<self>
     */
    public static function metadataOnly(): array
    {
        return [];
    }
}
