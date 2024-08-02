<?php

namespace App\Service\Shopify\Webhook\Topic;

use App\DTO\OrderDTO;
use App\Entity\Order;
use App\Entity\Store;
use App\Entity\Webhook;
use App\Repository\StoreRepository;
use App\Service\GidService;
use App\Service\Shopify\Context;
use App\Service\Shopify\GraphQL\Customer;
use App\Service\Shopify\GraphQL\Product;
use App\Service\Shopify\Webhook\Base;
use App\Service\Shopify\Webhook\WebhookHandlerInterface;
use App\Service\Shopify\Webhook\WebhookTransformer;
use App\Transformer\OrderTransformer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class Orders extends Base implements WebhookHandlerInterface
{
    private WebhookTransformer $transformer;

    public function __construct(EntityManagerInterface $entityManager, SerializerInterface $serializer, WebhookTransformer $transformer)
    {
        parent::__construct($entityManager, $serializer);
        $this->transformer = $transformer;
    }

    public function create(Webhook $webhook, Request $request): JsonResponse
    {
        /** @var StoreRepository $storeRepository */
        $storeRepository = $this->entityManager->getRepository(Store::class);

        $store = $storeRepository->findOneBy(["host" => $webhook->getShopDomain()]);

        if (!$store) {
            return new JsonResponse(Response::HTTP_NO_CONTENT);
        }

        $transformer = new OrderTransformer();
        $orderDTO = OrderDTO::fromRequest($request);
        $order = $transformer->transformToEntity($orderDTO);

        $orderRepository = $this->entityManager->getRepository(Order::class);
        $orderDb = $orderRepository->findOneBy([
            'orderId' => $order->getOrderId()
        ]);

        if (!$orderDb) {
            $this->entityManager->persist($order);
            $this->entityManager->flush();
        }

        return new JsonResponse(Response::HTTP_OK);
    }

    public function transform(OrderDTO $dto): Order
    {
        try {
            $context = [
                AbstractNormalizer::CALLBACKS => [
                    'price' => function ($price) {
                        return (float) $price;
                    },
                ],
            ];

            $orderData = [
                'orderId' => $dto->orderId,
                'customerName' => $dto->customerName,
                'location' => $dto->location,
                'productTitle' => $dto->productTitle,
            ];

            return $this->serializer->denormalize($orderData, Order::class, null, $context);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}