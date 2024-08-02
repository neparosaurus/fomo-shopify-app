<?php

namespace App\Controller\API;

use App\Entity\Configuration;
use App\Repository\ConfigurationRepository;
use App\Repository\OrderRepository;
use App\Service\Shopify\Context;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class ConfigurationController
{
    private ConfigurationRepository $configurationRepository;
    private EntityManagerInterface $entityManager;


    public function __construct(ConfigurationRepository $configurationRepository, EntityManagerInterface $entityManager)
    {
        Context::initialize();
        $this->configurationRepository = $configurationRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/configuration', name: 'api_update_configuration', methods: ['POST'])]
    public function update(Request $request, OrderRepository $orderRepository, SerializerInterface $serializer)
    {
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $newConfiguration = $serializer->deserialize($request->getContent(), Configuration::class, 'json');
        $store = Context::getStore();
        $configuration = $store->getConfiguration();
        $configuration->setFontFamily($newConfiguration->getFontFamily());
        $configuration->setBackgroundColor($newConfiguration->getBackgroundColor());
        $configuration->setTextColor($newConfiguration->getTextColor());
        $configuration->setInitialDelay($newConfiguration->getInitialDelay());
        $configuration->setDelay($newConfiguration->getDelay());
        $configuration->setDuration($newConfiguration->getDuration());
        $configuration->setCornerStyle($newConfiguration->getCornerStyle());
        $configuration->setPosition($newConfiguration->getPosition());
        $configuration->setThresholdType($newConfiguration->getThresholdType());
        $configuration->setThresholdMinutes($newConfiguration->getThresholdMinutes());
        $configuration->setThresholdCount($newConfiguration->getThresholdCount());

        $this->entityManager->persist($configuration);
        $this->entityManager->flush();

        $ordersShowing = [];

        if ($configuration->getThresholdType() === 0) {
            $ordersShowing = $orderRepository->getWithMinutesLimit($store, $configuration->getThresholdMinutes());
        } else if ($configuration->getThresholdType() === 1) {
            $ordersShowing = $orderRepository->getWithOrdersLimit($store, $configuration->getThresholdCount());
        }

        $ordersLength = sizeof($store->getOrders());
        $ordersShowingLength = sizeof($ordersShowing);

        $data = [
            'ordersLength' => $ordersLength,
            'ordersShowingLength' => $ordersShowingLength,
            'appEnabled' => $store->isEnabled(),
            'fontFamily' => $configuration->getFontFamily(),
            'fontSize' => $configuration->getFontSize(),
            'backgroundColor' => $configuration->getBackgroundColor(),
            'textColor' => $configuration->getTextColor(),
            'initialDelay' => $configuration->getInitialDelay(),
            'delay' => $configuration->getDelay(),
            'duration' => $configuration->getDuration(),
            'cornerStyle' => $configuration->getCornerStyle(),
            'position' => $configuration->getPosition(),
            'thresholdType' => $configuration->getThresholdType(),
            'thresholdMinutes' => $configuration->getThresholdMinutes(),
            'thresholdCount' => $configuration->getThresholdCount(),
            'loopOrders' => $configuration->isLoopOrders(),
            'shuffleOrders' => $configuration->isShuffleOrders(),
        ];

        return new JsonResponse(json_encode($data), Response::HTTP_OK, [], true);
    }
}