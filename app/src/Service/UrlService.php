<?php

namespace App\Service;

class UrlService
{
    public static function toUrl(string $path): string
    {
        return 'https://'.$_ENV['SHOPIFY_HOST_NAME'].'/'.$path;
    }
}