<?php

namespace App\Service\Shopify;

use App\Repository\StoreRepository;
use Symfony\Component\HttpFoundation\Request;

class Auth extends Context
{
    public static function isRequestVerified(Request $request): bool
    {
        $queryData = $request->query->all();

        if (!isset($queryData['hmac'])) {
            return false;
        }

        $hmac = $queryData['hmac'];
        unset($queryData['hmac']);

        $computedHmac = hash_hmac('sha256', http_build_query($queryData), parent::getApiSecretKey());

        return hash_equals($hmac, $computedHmac);
    }

    public static function authorizeStore(Request $request, StoreRepository $repository): bool
    {
        $host = $request->query->get('shop');

        if (is_null($host)) {
            return false;
        }

        $storeDb = $repository->getByHost($host);

        if (is_null($storeDb) || !$storeDb->isActive()) {
            return false;
        }

        Context::setStore($storeDb);

        return true;
    }

    public static function createAuthRequestUrl($store, $redirectUrl): string
    {
        return 'https://'.$store.'/admin/oauth/authorize?client_id='. parent::getApiKey().'&scope='.parent::getScopes().'&redirect_uri='.urlencode($redirectUrl).'&access_mode='.parent::getAccessMode();
    }

    public static function getStorefrontAccessToken($store, $code): ?string
    {
        $query = array(
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'client_id' => parent::getApiKey(),
                'client_secret' => parent::getApiSecretKey(),
                'code' => $code,
                'test' => true
            ],
        );

        $accessTokenUrl = 'https://'.$store.'/admin/oauth/access_token';
        $apiResponse = Http::sendRequest($accessTokenUrl, 'POST', $query);

        if ($apiResponse->isSuccess() && array_key_exists('access_token', $apiResponse->getBody())) {
            return $apiResponse->getBody()['access_token'];
        }

        return null;
    }
}