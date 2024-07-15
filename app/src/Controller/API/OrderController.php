<?php

namespace App\Controller\API;

use App\Repository\OrderRepository;
use App\Service\Shopify\Context;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class OrderController
{
    private OrderRepository $repository;
    private SerializerInterface $serializer;

    public function __construct(OrderRepository $repository, SerializerInterface $serializer)
    {
        Context::initialize();
        $this->repository = $repository;
        $this->serializer = $serializer;
    }

    #[Route("/orders", name: "api_get_all_orders", methods: ["GET"])]
    public function getAll(Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $orders = $this->repository->getOrders(Context::getStore(), $page);

        $jsonOrders = $this->serializer->serialize($orders, 'json', [
            AbstractNormalizer::GROUPS => ['order', 'lineItem']
        ]);

        return new JsonResponse($jsonOrders, Response::HTTP_OK, [], true);
    }
}