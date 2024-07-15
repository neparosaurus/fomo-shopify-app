<?php

namespace App\Service;

class UrlService
{
    public static function toUrl(string $path): string
    {
        return $_ENV['SHOPIFY_API_KEY'].'/'.$path;
    }
}