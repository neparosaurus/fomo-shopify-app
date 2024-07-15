<?php

namespace App\Service\Shopify\Webhook;

use App\Repository\StoreRepository;
use App\Service\Shopify\Context;
use Symfony\Component\HttpFoundation\Request;

class WebhookAuth extends Context
{
    public static function isRequestVerified(Request $request): bool
    {
        $hmac = $request->headers->get("X-Shopify-Hmac-Sha256");

        if (is_null($hmac)) {
            return false;
        }

        $computedHmac = base64_encode(hash_hmac('sha256', $request->getContent(), parent::getApiSecretKey(), true));

        return hash_equals($hmac, $computedHmac);
    }

    public static function authorizeStore(Request $request, StoreRepository $repository): bool
    {
        $host = $request->headers->get('X-Shopify-Shop-Domain');

        if (is_null($host)) {
            return false;
        }

        $storeDb = $repository->getByHost($host);

        if (is_null($storeDb)) {
            return false;
        }

        Context::setStore($storeDb);

        return true;
    }
}