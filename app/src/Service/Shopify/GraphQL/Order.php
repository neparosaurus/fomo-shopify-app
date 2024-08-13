<?php

namespace App\Service\Shopify\GraphQL;

use App\Service\Shopify\Response;

class Order extends Base
{
    public static function get($ordersPerPage = 10, $cursor = null): Response
    {
        $query = <<<QUERY
          query GetOrders(\$ordersPerPage: Int!, \$cursor: String) {
            orders(first: \$ordersPerPage, after: \$cursor, sortKey: CREATED_AT, reverse: true) {
              pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor
              }
              edges {
                node {
                  id
                  orderNumber: name
                  processedAt
                  displayAddress {
                    city
                  }
                  customer {
                    displayName
                  }
                  lineItems(first: 1) {
                    edges {
                      node {
                        name,
                        product {
                          handle,
                          featuredImage {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        QUERY;

        $variables = [
            'ordersPerPage' => $ordersPerPage,
            'cursor' => $cursor,
        ];

        return parent::fetch($query, $variables);
    }
}