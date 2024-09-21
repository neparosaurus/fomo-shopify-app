<?php

namespace App\Controller;

use App\Entity\Store;
use App\Repository\OrderRepository;
use App\Repository\StoreRepository;
use App\Service\ColorService;
use App\Service\Shopify\Context;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

    #[Route('/public/script.js', name: 'public_script')]
    public function script(Request $request): Response
    {
        $store = $request->query->get("store");
        $csrf = $request->query->get("csrf");

        if (!$store || !$csrf) {
            return new JsonResponse(["error" => "Invalid request"], Response::HTTP_BAD_REQUEST, []);
        }

        /** @var Store $storeDb */
        $storeDb = $this->storeRepository->getByHost($store);

        if (!$storeDb) {
            return new JsonResponse(["error" => "No store found"], Response::HTTP_BAD_REQUEST, []);
        }

        $now = date("Y-m-d-H");
        $key = $storeDb->getHost().$now;
        $localCsrf = md5($key);

        if ($csrf !== $localCsrf) {
            // Check for hours overlap
            $dateTime = new DateTime();
            $dateTime->modify('-1 hour');
            $now = $dateTime->format("Y-m-d-H");
            $key = $storeDb->getHost().$now;
            $localCsrf = md5($key);

            if ($csrf !== $localCsrf) {
                return new JsonResponse(["error" => "Csrf token mismatch"], Response::HTTP_BAD_REQUEST, []);
            }
        }

        $configuration = $storeDb->getConfiguration();
        $orders = [];

        if ($configuration->getThresholdType() === 0) {
            $orders = $this->orderRepository->getWithMinutesLimit($storeDb, $configuration->getThresholdMinutes());
        } else if ($configuration->getThresholdType() === 1) {
            $orders = $this->orderRepository->getWithOrdersLimit($storeDb, $configuration->getThresholdCount());
        }

        $ordersArray = $this->serializer->normalize($orders, null, [
            AbstractNormalizer::GROUPS => ['order']
        ]);

        $data = [
            "orders" => $ordersArray,
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
            'hideTimeInOrders' => $configuration->isHideTimeInOrders(),
            'hideLocationInOrders' => $configuration->isHideLocationInOrders(),
            'showThumbnail' => $configuration->isShowThumbnail(),
            'showThumbnailPadding' => $configuration->isShowThumbnailPadding(),
            'thumbnailPosition' => $configuration->getThumbnailPosition(),
            'thumbnailSize' => $configuration->getThumbnailSize(),
        ];

        return new Response(
            $this->renderView("public_script.js.twig", $data),
            200,
            ["Content-Type" => "application/javascript"]
        );
    }

    #[Route('/public/data.json', name: 'public_json')]
    public function jsonOutput(Request $request): JsonResponse
    {
        $store = $request->query->get("store");

        if (!$store) {
            return new JsonResponse(json_encode(["error" => "No store request"]), Response::HTTP_BAD_REQUEST, [], true);
        }

        /** @var Store $storeDb */
        $storeDb = $this->storeRepository->getByHost($store);

        if (!$storeDb) {
            return new JsonResponse(json_encode(["error" => "No store found"]), Response::HTTP_BAD_REQUEST, [], true);
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

        $data = [
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
            'hideTime' => $configuration->isHideTimeInOrders(),
        ];

        return new JsonResponse(json_encode($data, true), Response::HTTP_OK, [], true);
    }
}