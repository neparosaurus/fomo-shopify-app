<?php

namespace App\Controller;

use App\DTO\WebhookDTO;
use App\Repository\StoreRepository;
use App\Service\Shopify\Context;
use App\Service\Shopify\Webhook\WebhookAuth;
use App\Service\Shopify\Webhook\WebhookHandlerManager;
use App\Service\Shopify\Webhook\WebhookTransformer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WebhookController
{
    private WebhookHandlerManager $webhookHandlerManager;

    public function __construct(WebhookHandlerManager $webhookHandlerManager)
    {
        $this->webhookHandlerManager = $webhookHandlerManager;
        Context::initialize();
    }

    #[Route("/webhook", name: "app_webhook")]
    public function index(Request $request, StoreRepository $repository, WebhookTransformer $transformer): Response
    {
        if (!WebhookAuth::isRequestVerified($request)) {
            return new Response('Webhook not verified', Response::HTTP_UNAUTHORIZED);
        }

        if (!WebhookAuth::authorizeStore($request, $repository)) {
            return new Response('Webhook store not authorized', Response::HTTP_UNAUTHORIZED);
        }

        $webhookDTO = new WebhookDTO($request);
        $webhook = $transformer->transform($webhookDTO);
        $this->webhookHandlerManager->handleWebhook($webhook, $request);

        return new Response('Webhook received', Response::HTTP_OK);
    }
}