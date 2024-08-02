<?php

namespace App\Service\Shopify\GraphQL;

use App\Service\Shopify\Context;
use App\Service\Shopify\Http;
use App\Service\Shopify\Response;

class Base
{
    protected static function fetch($query, $variables = null): Response
    {
        $endpointUrl = Http::generateUrl("/admin/api/" . Context::getApiVersion() . "/graphql.json");
        $body = array(
            "json" => [
                "query" => $query,
            ]
        );

        if (!is_null($variables)) {
            $body["json"]["variables"] = $variables;
        };

        return Http::sendRequest($endpointUrl, Http::METHOD_POST, Http::generateOptions($body));
    }
}