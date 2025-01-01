<?php

namespace App\Service;

class FieldExtractorService
{
    public function extractValuesToFetch(string $textContent): array
    {
        $valuesToFetch = ['productImage'];

        if (str_contains($textContent, '{{ customer }}')) {
            $valuesToFetch[] = 'customerName';
        }
        if (str_contains($textContent, '{{ location }}')) {
            $valuesToFetch[] = 'location';
        }
        if (str_contains($textContent, '{{ product }}')) {
            $valuesToFetch[] = 'productTitle';
            $valuesToFetch[] = 'productHandle';
        }
        if (str_contains($textContent, '{{ time }}')) {
            $valuesToFetch[] = 'createdAt';
        }

        return $valuesToFetch;
    }
}