<?php

namespace App\EventListener;

use App\Repository\StoreRepository;
use App\Service\Shopify\Context;
use Symfony\Component\HttpKernel\Event\ControllerEvent;

class StoreListener
{
    private StoreRepository $repository;

    public function __construct(StoreRepository $repository)
    {
        $this->repository = $repository;
    }

    public function onKernelController(ControllerEvent $event): void
    {
        $request = $event->getRequest();

        if (!str_starts_with($request->getPathInfo(), '/api/') && !str_starts_with($request->getPathInfo(), '/sse')) {
            return;
        }

        $authorizationBearer = $request->headers->get('Authorization') ? $request->headers->get('Authorization') : $request->query->get('token');
        $token = str_replace('Bearer ', '', $authorizationBearer);

        if ($token === "") {
            return;
        }

        [$header, $payload, $signature] = explode('.', $token);
        $payload = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
        $host = $payload['username'];

        $store = $this->repository->findOneBy(['host' => $host]);

        if ($store) {
            Context::setStore($store);
        }
    }
}