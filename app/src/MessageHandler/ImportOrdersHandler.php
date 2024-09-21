<?php

namespace App\MessageHandler;

use App\DTO\OrderDTO;
use App\Entity\Order as OrderEntity;
use App\Message\ImportOrders;
use App\Repository\OrderRepository;
use App\Service\Shopify\GraphQL\Order;
use App\Transformer\OrderTransformer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ImportOrdersHandler
{
    private EntityManagerInterface $entityManager;
    private OrderRepository $orderRepository;

    public function __construct(EntityManagerInterface $entityManager, OrderRepository $orderRepository)
    {
        $this->entityManager = $entityManager;
        $this->orderRepository = $orderRepository;
    }

    public function __invoke(ImportOrders $importOrders)
    {
        $ordersPerPage = 100;
        $ordersToImport = 300;
        $nextPageCursor = null;

        for ($i = 0; $i < $ordersToImport; $i += $ordersPerPage) {
            $apiData = Order::get($ordersPerPage, $nextPageCursor)->getBody();

            if (!isset($apiData['data']) || !isset($apiData['data']['orders']) || !isset($apiData['data']['orders']['pageInfo'])) {
                return;
            }

            $ordersData = $apiData['data']['orders'];

            $transformer = new OrderTransformer();

            foreach ($ordersData['edges'] as $node) {
                $orderDTO = OrderDTO::fromGraphQLResponse($node['node']);
                $order = $transformer->transformToEntity($orderDTO);

                $this->entityManager->persist($order);
            }

            $this->entityManager->flush();

            if ($apiData['data']['orders']['pageInfo']['hasNextPage']) {
                $nextPageCursor = $apiData['data']['orders']['pageInfo']['endCursor'];
            } else {
                break;
            }
        }
    }
}