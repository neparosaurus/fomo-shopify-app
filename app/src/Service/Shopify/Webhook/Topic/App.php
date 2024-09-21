<?php

namespace App\Service\Shopify\Webhook\Topic;

use App\Entity\Store;
use App\Entity\Webhook;
use App\Repository\OrderRepository;
use App\Repository\StoreRepository;
use App\Service\Shopify\Webhook\Base;
use App\Service\Shopify\Webhook\DTOInterface;
use App\Service\Shopify\Webhook\WebhookHandlerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class App extends Base implements WebhookHandlerInterface
{
    private StoreRepository $storeRepository;
    private OrderRepository $orderRepository;

    public function __construct(EntityManagerInterface $entityManager, SerializerInterface $serializer, StoreRepository $storeRepository, OrderRepository $orderRepository)
    {
        parent::__construct($entityManager, $serializer);
        $this->storeRepository = $storeRepository;
        $this->orderRepository = $orderRepository;
    }

    public function uninstalled(Webhook $webhook, Request $request)
    {
        $store = $this->storeRepository->findOneBy(["host" => $webhook->getShopDomain()]);

        if (!$store) {
            return new JsonResponse(Response::HTTP_NO_CONTENT);
        }

        $this->storeRepository->setStoreInactive($store);
        $this->orderRepository->removeAll($store);

        return new JsonResponse(Response::HTTP_OK);
    }

    public function transform(DTOInterface $dto)
    {
        // TODO: Implement transform() method.
    }
}