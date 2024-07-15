<?php

namespace App\DTO;

use App\Entity\LineItem;
use App\Service\Shopify\Webhook\DTOInterface;
use DateTime;
use Symfony\Component\HttpFoundation\Request;

class OrderDTO implements DTOInterface
{
    public string $orderId;
    public string $customerName;
    public string $location;
    public string $productTitle;
    public function __construct(array $data)
    {
        $this->orderId = $data['id'] ?? 0;
        $this->customerName = $data['customer']['default_address']['name'] ?? "";
        $this->location = $data['shipping_address']['city'] ?? "";
        $this->productTitle = $data['line_items'][0]['name'] ?? "";
    }

    public static function fromRequest(Request $request): self
    {
        $decodedContent = json_decode($request->getContent(), true);

        return new self($decodedContent);
    }

    public static function fromGraphQLResponse(array $node): self
    {
        return new self([
            'id' => self::getIdFromGid($node['id']),
            'order_number' => self::getOrderNumber($node['orderNumber']),
            'customer' => $node['customer'] ? [
                'id' => self::getIdFromGid($node['customer']['id']),
                'name' => $node['customer']['displayName']
            ] : [
                'id' => "",
                'name' => ""
            ],
            'total_price' => '0',
            'financial_status' => strtolower($node['displayFinancialStatus']),
            'currency' => $node['currencyCode'],
            'updated_at' => $node['updatedAt'],
            'line_items' => array_map(function ($lineItem) {
                return [
                    'id' => self::getIdFromGid($lineItem['node']['id']),
                    'name' => $lineItem['node']['name'],
                    'price' => $lineItem['node']['originalTotalSet']['presentmentMoney']['amount'],
                    'quantity' => $lineItem['node']['quantity'],
                    'sku' => $lineItem['node']['sku'],
                    'total_discount' => $lineItem['node']['discountedTotalSet']['presentmentMoney']['amount'],
                    'product_id' => self::getIdFromGid($lineItem['node']['product']['id']),
                    'variant_id' => self::getIdFromGid($lineItem['node']['variant']['id']),
                    'properties' => array_map(function ($property) {
                        return [
                            'name' => $property['key'],
                            'value' => $property['value'],
                        ];
                    }, $lineItem['node']['customAttributes']),
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