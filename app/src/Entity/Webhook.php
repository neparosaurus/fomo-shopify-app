<?php

namespace App\Entity;

class Webhook
{
    private string $topic;
    private string $hmac;
    private string $shopDomain;
    private string $apiVersion;
    private string $webhookId;
    private \DateTimeInterface $triggeredAt;
    private array $content;

    public function __construct()
    {
        $this->content = [];
    }

    public function getTopic(): string
    {
        return $this->topic;
    }

    public function setTopic(string $topic): void
    {
        $this->topic = $topic;
    }

    public function getHmac(): string
    {
        return $this->hmac;
    }

    public function setHmac(string $hmac): void
    {
        $this->hmac = $hmac;
    }

    public function getShopDomain(): string
    {
        return $this->shopDomain;
    }

    public function setShopDomain(string $shopDomain): void
    {
        $this->shopDomain = $shopDomain;
    }

    public function getApiVersion(): string
    {
        return $this->apiVersion;
    }

    public function setApiVersion(string $apiVersion): void
    {
        $this->apiVersion = $apiVersion;
    }

    public function getWebhookId(): string
    {
        return $this->webhookId;
    }

    public function setWebhookId(string $webhookId): void
    {
        $this->webhookId = $webhookId;
    }

    public function getTriggeredAt(): \DateTimeInterface
    {
        return $this->triggeredAt;
    }

    public function setTriggeredAt(\DateTimeInterface $triggeredAt): void
    {
        $this->triggeredAt = $triggeredAt;
    }

    public function getContent(): array
    {
        return $this->content;
    }

    public function setContent(array $content): void
    {
        $this->content = $content;
    }

    public function getResourceAsClass(): string
    {
        return str_replace(' ', '', ucwords(str_replace('_', ' ', explode('/', $this->getTopic())[0])));
    }

    public function getAction(): string
    {
        return explode('/', $this->getTopic())[1];
    }
}