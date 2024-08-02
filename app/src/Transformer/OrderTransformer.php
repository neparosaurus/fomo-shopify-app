<?php

namespace App\Transformer;

use App\DTO\OrderDTO;
use App\Entity\Order;
use App\Service\Shopify\Context;

class OrderTransformer
{
    public function transformToEntity(OrderDTO $orderDTO): Order
    {
        $order = new Order();
        $order->setOrderId($orderDTO->orderId);
        $order->setCustomerName($orderDTO->customerName);
        $order->setLocation($orderDTO->location);
        $order->setProductTitle($orderDTO->productTitle);
        $order->setProductHandle($orderDTO->productHandle);
        $order->setCreatedAt($orderDTO->createdAt);
        $order->setStore(Context::getStore());

        return $order;
    }
}