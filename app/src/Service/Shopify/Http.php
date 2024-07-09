<?php

namespace App\Service\Shopify;

use GuzzleHttp\Exception\BadResponseException;
use GuzzleHttp\Psr7\ServerRequest;

class Http extends Context
{
    const METHOD_GET = "GET";
    const METHOD_HEAD = "HEAD";
    const METHOD_POST = "POST";
    const METHOD_PUT = "PUT";
    const METHOD_DELETE = "DELETE";
    const METHOD_CONNECT = "CONNECT";
    const METHOD_OPTIONS = "OPTIONS";
    const METHOD_TRACE = "TRACE";
    const METHOD_PATCH = "PATCH";

    public static function sendRequest($url, $method, $query): Response
    {
        $client = new Client();

        $apiResponse = $client->request($method, $url, $query);

        if (!$apiResponse->isSuccess()) {
            throw new BadResponseException('Empty response', ServerRequest::fromGlobals(), $apiResponse->getOriginalResponse());
        }

        return $apiResponse;
    }

    public static function generateOptions($predefinedOptions = [], $tokenMode = 'accessToken'): array
    {
        return array_merge($predefinedOptions, array(
            "headers" => [
                "Content-Type" => "application/json",
                "X-Shopify-Access-Token" => $tokenMode === 'accessToken' ? parent::getStore()->getAccessToken() : parent::getApiSecretKey(),
            ],
        ));
    }

    public static function generateUrl($url): ?string
    {
        return 'https://' . parent::getStore()->getHost() . $url;
    }
}