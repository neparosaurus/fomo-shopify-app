<?php

namespace App\Controller;

use App\Entity\Store;
use App\Repository\StoreRepository;
use App\Service\ColorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ScriptController extends AbstractController
{
    private StoreRepository $storeRepository;
    private SerializerInterface $serializer;

    public function __construct(StoreRepository $storeRepository, SerializerInterface $serializer)
    {
        $this->storeRepository = $storeRepository;
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

        $orders = $storeDb->getOrders();
        $configuration = $storeDb->getConfiguration();

        $jsonOrders = $this->serializer->serialize($orders, 'json', [
            AbstractNormalizer::GROUPS => ['order']
        ]);

        return new Response(
            $this->renderView("public_script.js.twig", [
                "orders" => $jsonOrders,
                "fontFamily" => $configuration->getFontFamily(),
                "backgroundColor" => ColorService::hsbToRgba($configuration->getBackgroundColor()),
                "textColor" => ColorService::hsbToRgba($configuration->getTextColor()),
                "cornerStyle" => $configuration->getCornerStyle(),
                "duration" => $configuration->getDuration(),
                "initialDelay" => $configuration->getInitialDelay(),
                "delay" => $configuration->getDelay(),
            ]),
            200,
            ["Content-Type" => "application/javascript"]
        );
    }
}