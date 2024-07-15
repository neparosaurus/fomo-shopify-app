<?php

namespace App\Service\Shopify\Webhook;

use App\Entity\Webhook;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

class WebhookHandlerManager
{
    private ContainerInterface $container;
    private string $topicNamespace = "App\Service\Shopify\Webhook\Topic\\";

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function handleWebhook(Webhook $webhook, Request $request)
    {
        $topicClass = $this->topicNamespace . $webhook->getResourceAsClass();
        $topicMethod = $webhook->getAction();

        if ($this->container->has($topicClass)) {
            $handler = $this->container->get($topicClass);

            if ($handler instanceof WebhookHandlerInterface) {
                if (method_exists($handler, $topicMethod)) {
                    $handler->$topicMethod($webhook, $request);
                }
            }
        }
    }
}