<?php

namespace App\Controller;

use App\Entity\Store;
use App\Repository\OrderRepository;
use App\Repository\StoreRepository;
use App\Service\ColorService;
use App\Service\Shopify\Context;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ScriptController extends AbstractController
{
    private StoreRepository $storeRepository;
    private OrderRepository $orderRepository;
    private SerializerInterface $serializer;

    public function __construct(StoreRepository $storeRepository, OrderRepository $orderRepository, SerializerInterface $serializer)
    {
        $this->storeRepository = $storeRepository;
        $this->orderRepository = $orderRepository;
        $this->serializer = $serializer;
    }

    #[Route('/script', name: 'script')]
    public function index(Request $request)
    {
        $store = $request->query->get("store");

        if (!$store) {
            return new Response("No store request", 204, ["Content-Type" => "application/javascript"]);
        }

        /** @var Store $storeDb */
        $storeDb = $this->storeRepository->getByHost($store);

        if (!$storeDb) {
            return new Response("No store found", 204, ["Content-Type" => "application/javascript"]);
        }

        $configuration = $storeDb->getConfiguration();
        $orders = [];

        if ($configuration->getThresholdType() === 0) {
            $orders = $this->orderRepository->getWithMinutesLimit($storeDb, $configuration->getThresholdMinutes());
        } else if ($configuration->getThresholdType() === 1) {
            $orders = $this->orderRepository->getWithOrdersLimit($storeDb, $configuration->getThresholdCount());
        }

        $jsonOrders = $this->serializer->serialize($orders, 'json', [
            AbstractNormalizer::GROUPS => ['order']
        ]);

        return new Response(
            $this->renderView("public_script.js.twig", [
                "orders" => $jsonOrders,
                "fontFamily" => $configuration->getFontFamily(),
                "backgroundColor" => ColorService::hsbToRgba($configuration->getBackgroundColor()),
                "textColor" => ColorService::hsbToRgba($configuration->getTextColor()),
                "initialDelay" => $configuration->getInitialDelay(),
                "delay" => $configuration->getDelay(),
                "duration" => $configuration->getDuration(),
                "cornerStyle" => $configuration->getCornerStyle(),
                "position" => $configuration->getPosition(),
                'loopOrders' => $configuration->isLoopOrders(),
                'shuffleOrders' => $configuration->isShuffleOrders(),
            ]),
            200,
            ["Content-Type" => "application/javascript"]
        );
    }
}