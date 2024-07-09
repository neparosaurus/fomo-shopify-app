<?php

namespace App\Service\Shopify;

use App\Entity\Store;

class Context
{
    private static string $apiKey;
    private static string $apiSecretKey;
    private static string $scopes;
    private static string $hostName;
    private static string $accessMode;
    private static string $apiVersion;
    private static bool $isEmbeddedApp = true;
    private static bool $isPrivateApp = false;
    private static bool $isInitialized = false;
    private static Store|null $store = null;

    public static function initialize():void {
        self::$apiKey = $_ENV['SHOPIFY_API_KEY'];
        self::$apiSecretKey = $_ENV['SHOPIFY_API_SECRET'];
        self::$scopes = $_ENV['SHOPIFY_SCOPES'];
        self::$hostName = $_ENV['SHOPIFY_HOST_NAME'];
        self::$accessMode = $_ENV['SHOPIFY_ACCESS_MODE'];
        self::$apiVersion = $_ENV['SHOPIFY_API_VERSION'];
        self::$isEmbeddedApp = $_ENV['SHOPIFY_IS_EMBEDDED_APP'];
        self::$isPrivateApp = $_ENV['SHOPIFY_IS_PRIVATE_APP'];
        self::$isInitialized = true;
    }

    public static function getApiKey(): string
    {
        return self::$apiKey;
    }

    public static function getApiSecretKey(): string
    {
        return self::$apiSecretKey;
    }

    public static function getScopes(): string
    {
        return self::$scopes;
    }

    public static function getHostName(): string
    {
        return self::$hostName;
    }

    public static function getAccessMode(): string
    {
        return self::$accessMode;
    }

    public static function getApiVersion(): string
    {
        return self::$apiVersion;
    }

    public static function isEmbeddedApp(): bool
    {
        return self::$isEmbeddedApp;
    }

    public static function isPrivateApp(): bool
    {
        return self::$isPrivateApp;
    }

    public static function isInitialized(): bool
    {
        return self::$isInitialized;
    }

    public static function setStore(Store $store): void
    {
        self::$store = $store;
    }

    public static function getStore(): ?Store
    {
        return self::$store;
    }
}