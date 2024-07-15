<?php

namespace App\Service\Shopify\Webhook;

use App\DTO\WebhookDTO;
use App\Entity\Order;
use App\Entity\Webhook;
use Symfony\Component\Serializer\SerializerInterface;

class WebhookTransformer
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    public function transform(WebhookDTO $dto): Webhook
    {
        try {
            $webhookData = [
                'topic' => $dto->getTopic(),
                'hmac' => $dto->getHmac(),
                'shopDomain' => $dto->getShopDomain(),
                'apiVersion' => $dto->getApiVersion(),
                'webhookId' => $dto->getWebhookId(),
                'triggeredAt' => $dto->getTriggeredAt(),
                'content' => $dto->getContent(),
            ];

            return $this->serializer->denormalize($webhookData, Webhook::class);

        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function transformContent(DTOInterface $dto)
    {
        try {
            $webhookData = [
                'id' => $dto->getId(),
            ];

            return $this->serializer->denormalize($webhookData, Order::class);

        } catch (\Exception $e) {
            throw $e;
        }
    }
}