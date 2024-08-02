<?php

namespace App\DTO;

use App\Entity\LineItem;
use App\Service\GidService;
use App\Service\Shopify\GraphQL\Product;
use App\Service\Shopify\Webhook\DTOInterface;
use DateTime;
use Symfony\Component\HttpFoundation\Request;

class OrderDTO implements DTOInterface
{
    public string $orderId;
    public string $customerName;
    public string $location;
    public string $productTitle;
    public string $productHandle;
    public string $createdAt;

    public function __construct(array $data)
    {
        $this->orderId = $data['id'] ?? 0;
        $this->customerName = $data['customer']['default_address']['name'] ?? "";
        $this->location = $data['customer']['default_address']['city'] ?? "";
        $this->productTitle = $data['line_items'][0]['name'] ?? "";
        $this->productHandle = $data['line_items'][0]['handle'] ?? "";
        $this->createdAt = $data['created_at'] ?? "";
    }

    public static function fromRequest(Request $request): self
    {
        $decodedContent = json_decode($request->getContent(), true);
        $productGid = 'gid://shopify/Product/'.$decodedContent['line_items'][0]['product_id'];
        $decodedContent['line_items'][0]['handle'] = Product::getHandle($productGid)->getBody()['data']['product']['handle'];

        return new self($decodedContent);
    }

    public static function fromGraphQLResponse(array $node): self
    {
        return new self([
            'id' => self::getIdFromGid($node['id']),
            'order_number' => self::getOrderNumber($node['orderNumber']),
            'customer' => $node['customer'] ? [
                'default_address' => [
                    'name' => $node['customer']['displayName'],
                    'city' => $node['displayAddress']['city'],
                ]
            ] : [
                'default_address' => [
                    'name' => '',
                    'city' => '',
                ]
            ],
            'created_at' => $node['processedAt'],
            'line_items' => array_map(function ($lineItem) {
                return [
                    'name' => $lineItem['node']['name'],
                    'handle' => $lineItem['node']['product']['handle'],
                ];
            }, $node['lineItems']['edges']),
        ]);
    }

    private static function getOrderNumber($orderNumber): string
    {
        return str_replace('#', '', $orderNumber);
    }

    private static function getIdFromGid($gid) {
        $matches = [];
        preg_match('/\/(\d+)$/', $gid, $matches);
        return $matches[sizeof($matches) - 1];
    }
}