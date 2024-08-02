<?php

namespace App\Service\Shopify\GraphQL;

use App\Service\Shopify\Response;

class Product extends Base
{
    public static function getHandle($gid): Response
    {
        $query = <<<QUERY
            query GetProductHandle(\$gid: ID!) {
                product(id: \$gid) {
                    handle
                }
            }
        QUERY;

        $variables = [
            'gid' => $gid
        ];

        return parent::fetch($query, $variables);
    }
}