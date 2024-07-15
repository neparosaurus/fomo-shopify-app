<?php

namespace App\Service\Shopify\GraphQL;

class Webhook extends Base
{
    public static function create($topic, $callbackUrl)
    {
        $query = <<<QUERY
            mutation webhookSubscriptionCreate(\$topic: WebhookSubscriptionTopic!, \$webhookSubscription: WebhookSubscriptionInput!) {
                webhookSubscriptionCreate(topic: \$topic, webhookSubscription: \$webhookSubscription) {
                    webhookSubscription {
                        id
                        topic
                        format
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        QUERY;

        $variables = [
            "topic" => $topic,
            "webhookSubscription" => [
                "callbackUrl" => $callbackUrl,
                "format" => "JSON"
            ]
        ];

        return parent::fetch($query, $variables);
    }

    public static function delete($id)
    {
        $query = <<<QUERY
            mutation webhookSubscriptionDelete(\$id: ID!) {
              webhookSubscriptionDelete(id: \$id) {
                deletedWebhookSubscriptionId
                userErrors {
                  field
                  message
                }
              }
            }
        QUERY;

        $variables = [
            "id" => $id,
        ];

        return parent::fetch($query, $variables);
    }

    public static function getAll()
    {
        $query = <<<QUERY
            query {
              webhookSubscriptions(first: 10) {
                edges {
                  node {
                    id
                    topic
                    endpoint {
                      __typename
                      ... on WebhookHttpEndpoint {
                        callbackUrl
                      }
                    }
                  }
                }
              }
            }
        QUERY;

        return parent::fetch($query);
    }
}