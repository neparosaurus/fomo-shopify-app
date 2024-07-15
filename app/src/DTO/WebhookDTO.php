<?php

namespace App\DTO;

use App\Service\Shopify\Webhook\DTOInterface;
use Symfony\Component\HttpFoundation\Request;

class WebhookDTO implements DTOInterface
{
    private string $topic;
    private string $hmac;
    private string $shopDomain;
    private string $apiVersion;
    private string $webhookId;
    private string $triggeredAt;
    private array $content;

    public function __construct(Request $request) {
        $this->topic = $request->headers->get('X-Shopify-Topic');
        $this->hmac = $request->headers->get('X-Shopify-Hmac-Sha256');
        $this->shopDomain = $request->headers->get('X-Shopify-Shop-Domain');
        $this->apiVersion = $request->headers->get('X-Shopify-API-Version');
        $this->webhookId = $request->headers->get('X-Shopify-Webhook-Id');
        $this->triggeredAt = $request->headers->get('X-Shopify-Triggered-At');
        $this->content = json_decode($request->getContent(), true);
    }

    public function getTopic(): string
    {
        return $this->topic;
    }

    public function getHmac(): string
    {
        return $this->hmac;
    }

    public function getShopDomain(): string
    {
        return $this->shopDomain;
    }

    public function getApiVersion(): string
    {
        return $this->apiVersion;
    }

    public function getWebhookId(): string
    {
        return $this->webhookId;
    }

    public function getTriggeredAt(): string
    {
        return $this->triggeredAt;
    }

    public function getContent(): array
    {
        return $this->content;
    }
}