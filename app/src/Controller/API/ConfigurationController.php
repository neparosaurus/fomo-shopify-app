<?php

namespace App\Controller\API;

use App\Entity\Configuration;
use App\Repository\ConfigurationRepository;
use App\Repository\OrderRepository;
use App\Service\FieldExtractorService;
use App\Service\Shopify\Context;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class ConfigurationController
{
    private ConfigurationRepository $configurationRepository;
    private EntityManagerInterface $entityManager;
    private FieldExtractorService $fieldExtractor;


    public function __construct(ConfigurationRepository $configurationRepository, EntityManagerInterface $entityManager, FieldExtractorService $fieldExtractor)
    {
        Context::initialize();
        $this->configurationRepository = $configurationRepository;
        $this->entityManager = $entityManager;
        $this->fieldExtractor = $fieldExtractor;
    }

    #[Route('/configuration', name: 'api_update_configuration', methods: ['POST'])]
    public function update(Request $request, OrderRepository $orderRepository, SerializerInterface $serializer)
    {
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $jsonContent = $request->getContent();

        $newConfiguration = $serializer->deserialize($jsonContent, Configuration::class, 'json');
        $store = Context::getStore();
        $configurationDb = $store->getConfiguration();
        $configurationDb->setFontFamily($newConfiguration->getFontFamily());
        $configurationDb->setBackgroundColor($newConfiguration->getBackgroundColor());
        $configurationDb->setTextColor($newConfiguration->getTextColor());
        $configurationDb->setTextContent($newConfiguration->getTextContent());
        $configurationDb->setDesignTemplateId($newConfiguration->getDesignTemplateId());
        $configurationDb->setInitialDelay($newConfiguration->getInitialDelay());
        $configurationDb->setDelay($newConfiguration->getDelay());
        $configurationDb->setDuration($newConfiguration->getDuration());
        $configurationDb->setPosition($newConfiguration->getPosition());
        $configurationDb->setThresholdType($newConfiguration->getThresholdType());
        $configurationDb->setThresholdMinutes($newConfiguration->getThresholdMinutes());
        $configurationDb->setThresholdCount($newConfiguration->getThresholdCount());
        $configurationDb->setLoopOrders($newConfiguration->isLoopOrders());
        $configurationDb->setShuffleOrders($newConfiguration->isShuffleOrders());

        $this->entityManager->persist($configurationDb);
        $this->entityManager->flush();

        $ordersShowing = [];
        $valuesToFetch = $this->fieldExtractor->extractValuesToFetch($configurationDb->getTextContent());

        if ($configurationDb->getThresholdType() === 0) {
            $ordersShowing = $orderRepository->getWithMinutesLimit($store, $configurationDb->getThresholdMinutes(), $valuesToFetch);
        } else if ($configurationDb->getThresholdType() === 1) {
            $ordersShowing = $orderRepository->getWithOrdersLimit($store, $configurationDb->getThresholdCount(), $valuesToFetch);
        }

        $ordersLength = sizeof($store->getOrders());
        $ordersShowingLength = sizeof($ordersShowing);

        $data = [
            'ordersLength' => $ordersLength,
            'ordersShowingLength' => $ordersShowingLength,
            'appEnabled' => $store->isEnabled(),
            'fontFamily' => $configurationDb->getFontFamily(),
            'fontSize' => $configurationDb->getFontSize(),
            'backgroundColor' => $configurationDb->getBackgroundColor(),
            'textColor' => $configurationDb->getTextColor(),
            'textContent' => $configurationDb->getTextContent(),
            'designTemplateId' => $configurationDb->getDesignTemplateId(),
            "showThumbnail" => $configurationDb->isShowThumbnail(),
            "thumbnailPosition" => $configurationDb->getThumbnailPosition(),
            "verticalAlignment" => $configurationDb->getVerticalAlignment(),
            "cornerRadius" => $configurationDb->getCornerRadius(),
            "rtl" => $configurationDb->isRtl(),
            'initialDelay' => $configurationDb->getInitialDelay(),
            'delay' => $configurationDb->getDelay(),
            'duration' => $configurationDb->getDuration(),
            'position' => $configurationDb->getPosition(),
            'thresholdType' => $configurationDb->getThresholdType(),
            'thresholdMinutes' => $configurationDb->getThresholdMinutes(),
            'thresholdCount' => $configurationDb->getThresholdCount(),
            'loopOrders' => $configurationDb->isLoopOrders(),
            'shuffleOrders' => $configurationDb->isShuffleOrders(),
        ];

        return new JsonResponse(json_encode($data, true), Response::HTTP_OK, [], true);
    }
}