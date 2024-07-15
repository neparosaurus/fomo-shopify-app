<?php

namespace App\Service\Shopify\Webhook\Topic;

use App\Entity\Store;
use App\Entity\Webhook;
use App\Repository\StoreRepository;
use App\Service\Shopify\Webhook\Base;
use App\Service\Shopify\Webhook\DTOInterface;
use App\Service\Shopify\Webhook\WebhookHandlerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class App extends Base implements WebhookHandlerInterface
{
    public function uninstalled(Webhook $webhook)
    {
        /** @var StoreRepository $storeRepository */
        $storeRepository = $this->entityManager->getRepository(Store::class);

        $store = $storeRepository->findOneBy(["host" => $webhook->getShopDomain()]);

        if (!$store) {
            return new JsonResponse(Response::HTTP_NO_CONTENT);
        }

        $storeRepository->setStoreInactive($store);

        return new JsonResponse(Response::HTTP_OK);
    }

    public function transform(DTOInterface $dto)
    {
        // TODO: Implement transform() method.
    }
}