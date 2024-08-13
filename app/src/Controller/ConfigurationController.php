<?php

namespace App\Controller;

use App\Entity\Store;
use App\Repository\OrderRepository;
use App\Repository\StoreRepository;
use App\Service\ColorService;
use DateTime;
use DateTimeZone;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ConfigurationController extends AbstractController
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

    #[Route('/public/data.json', name: 'config_json', methods: ['GET'])]
    public function index(Request $request)
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


        $timezones = DateTimeZone::listIdentifiers();
        $csrfPass = false;

        foreach ($timezones as $timezone) {
            $localDate = new DateTime('now', new DateTimeZone($timezone));
            $now = $localDate->format('Y-m-d-H');
            $key = $storeDb->getHost().$now;
            $localCsrf = md5($key);

            if ($localCsrf === $csrf) {
                $csrfPass = true;
            }
        }

        if (!$csrfPass) {
            return new JsonResponse([
                "error" => "Csrf token mismatch",
            ], Response::HTTP_BAD_REQUEST, []);
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
            'showThumbnail' => $configuration->isShowThumbnail(),
            'thumbnailPosition' => $configuration->getThumbnailPosition(),
        ];

        $response = new JsonResponse($data, Response::HTTP_OK, []);

        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Authorization');

        return $response;
    }
}