<?php

namespace App\Controller;

use App\DTO\OrderDTO;
use App\Entity\Order as OrderEntity;
use App\Service\Shopify\Context;
use App\Service\Shopify\GraphQL\Order;
use App\Transformer\OrderTransformer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/sse')]
class SSEController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        Context::initialize();
        $this->entityManager = $entityManager;
    }

    #[Route('/import/orders', name: 'app_import')]
    public function index()
    {
        $response = new StreamedResponse(function() {
            $hasNextPage = true;
            $cursor = null;
            $ordersLimit = 20;
            $ordersCount = 0;

            while ($hasNextPage && $ordersCount <= $ordersLimit) {
                $apiData = Order::get(10, $cursor)->getBody();

                $ordersData = $apiData['data']['orders'];
                $transformer = new OrderTransformer();
                $orderRepository = $this->entityManager->getRepository(OrderEntity::class);

                /** @var OrderEntity[] $orders */
                $orders = array_reduce($ordersData['edges'], function ($carry, $node) use ($ordersCount, $orderRepository, $transformer) {
                    $orderDTO = OrderDTO::fromGraphQLResponse($node['node']);
                    $order = $transformer->transformToEntity($orderDTO);

                    $orderDb = $orderRepository->findOneBy([
                        'orderId' => $order->getOrderId()
                    ]);

                    if (!$orderDb) {
                        $this->entityManager->persist($order);
                        ++$ordersCount;
                    }

                    $carry[] = $order;

                    return $carry;
                }, []);

                $cursor = $apiData['data']['orders']['pageInfo']['endCursor'];
                $hasNextPage = $apiData['data']['orders']['pageInfo']['hasNextPage'];

                if (!empty($orders)) {
                    $this->entityManager->flush();
                }

                $orderIds = array_map(function($order) {
                    return [
                        "id" => $order->getOrderId(),
                        "order_number" => $order->getNumber(),
                    ];
                }, $orders);

                $output = json_encode([
                    "imported" => sizeof($orders),
                    "orders" => $orderIds,
                    "cursor" => $cursor
                ]);

                echo "data: " . $output . "\n\n";
                ob_flush();
                flush();
            }

            $store = Context::getStore();

            $this->entityManager->persist($store);
            $this->entityManager->flush();
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');

        return $response;
    }
}