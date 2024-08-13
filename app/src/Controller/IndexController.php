<?php

namespace App\Controller;

use App\DTO\OrderDTO;
use App\Entity\Configuration;
use App\Entity\Order as OrderEntity;
use App\Entity\Store;
use App\Repository\ConfigurationRepository;
use App\Repository\OrderRepository;
use App\Repository\StoreRepository;
use App\Service\Shopify\Auth;
use App\Service\Shopify\Context;
use App\Service\Shopify\GraphQL\Order;
use App\Service\Shopify\GraphQL\Webhook;
use App\Service\UrlService;
use App\Transformer\OrderTransformer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class IndexController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        Context::initialize();
        $this->entityManager = $entityManager;
    }

    #[Route('/{reactRouting}',
        name: 'app_index',
        requirements: [
            'reactRouting' => "^(?!api|_(profiler|wdt)|script|c|install|auth/callback|webhook)(sse/.*)?$",
        ],
    )]
    public function index(Request $request, StoreRepository $storeRepository, ConfigurationRepository $configurationRepository, OrderRepository $orderRepository): Response
    {
        if (!Auth::isRequestVerified($request) || !Auth::authorizeStore($request, $storeRepository)) {
            return $this->redirectToRoute('app_install');
        }

        $store = Context::getStore();
        /** @var Configuration $configuration */
        $configuration = $configurationRepository->findOneBy([
            'store' => $store
        ]);

        $ordersShowing = [];

        if ($configuration->getThresholdType() === 0) {
            $ordersShowing = $orderRepository->getWithMinutesLimit(Context::getStore(), $configuration->getThresholdMinutes());
        } else if ($configuration->getThresholdType() === 1) {
            $ordersShowing = $orderRepository->getWithOrdersLimit(Context::getStore(), $configuration->getThresholdCount());
        }

        $ordersLength = sizeof($store->getOrders());
        $ordersShowingLength = sizeof($ordersShowing);

        return $this->render('embed_app.html.twig', [
            'shopify_api_key' => $_ENV['SHOPIFY_API_KEY'],
            'initial_data' => [
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
                'hideTimeInOrders' => $configuration->isHideTimeInOrders(),
                'showThumbnail' => $configuration->isShowThumbnail(),
                'thumbnailPosition' => $configuration->getThumbnailPosition(),
            ],
        ]);
    }

    #[Route('/install', name: 'app_install')]
    public function install(Request $request): Response|RedirectResponse
    {
        $store = $request->query->get('shop');

        if (!$store) {
            return $this->render("install.html.twig");
        }

        if (!preg_match('/^[a-zA-Z0-9\-]+\.myshopify\.com$/', $store)) {
            $this->addFlash("error", "Invalid store");
            return $this->redirectToRoute("app_install");
        }

        $redirectUrl = $this->generateUrl('app_auth_callback', [], UrlGeneratorInterface::ABSOLUTE_URL);
        $redirectUrl = str_replace('http:', 'https:', $redirectUrl);
        $authRequestUrl = Auth::createAuthRequestUrl($store, $redirectUrl);

        return $this->redirect($authRequestUrl);
    }

    #[Route('/auth/callback', name: 'app_auth_callback')]
    public function authCallback(Request $request, EntityManagerInterface $entityManager): Response
    {
        if (!Auth::isRequestVerified($request)) {
            $this->addFlash("error", "Not verified request");
            return $this->redirectToRoute("app_install");
        }

        $host = $request->query->get('shop');
        $code = $request->query->get('code');

        $accessToken = Auth::getStorefrontAccessToken($host, $code);

        if (!$accessToken) {
            $this->addFlash("error", "Invalid access token");
            return $this->redirectToRoute("app_install");
        }

        /** @var Store $store */
        $store = $entityManager->getRepository(Store::class)?->getByHost($host);

        if ($store) {
            if ($store->isActive()) {
                $this->addFlash("info", "Store <b>{$store->getHost()}</b> is already installed");
                return $this->redirectToRoute("app_install");
            }

            $store->setIsActive(true);
            $store->setAccessToken($accessToken);

            $entityManager->persist($store);
        } else {
            $store = new Store();
            $store->setAccessToken($accessToken);
            $store->setHost($host);
            $store->setIsActive(true);

            $configuration = new Configuration();
            $configuration->setStore($store);
            $store->setConfiguration($configuration);

            $entityManager->persist($store);
            $entityManager->persist($configuration);
        }

        $entityManager->flush();

        Context::setStore($store);

        // Setup webhooks
        $webhookAppUninstalled = Webhook::create(
            "APP_UNINSTALLED",
            UrlService::toUrl('webhook'),
        );

        $webhookOrderCreate = Webhook::create(
            'ORDERS_CREATE',
            UrlService::toUrl('webhook'),
        );

        $this->importOrders();

        $this->addFlash("success", "App successfully installed to <b>{$store->getHost()}</b>");
        return $this->redirectToRoute('app_index', [
            'reactRouting' => ''
        ]);
    }

    private function importOrders(): void
    {
        $apiData = Order::get(50)->getBody();

        if (!isset($apiData['data']) || !isset($apiData['data']['orders'])) {
            return;
        }

        $ordersData = $apiData['data']['orders'];
        $transformer = new OrderTransformer();
        $orderRepository = $this->entityManager->getRepository(OrderEntity::class);

        /** @var OrderEntity[] $orders */
        $orders = array_reduce($ordersData['edges'], function ($carry, $node) use ($orderRepository, $transformer) {
            $orderDTO = OrderDTO::fromGraphQLResponse($node['node']);
            $order = $transformer->transformToEntity($orderDTO);

            $this->entityManager->persist($order);
        });

        $this->entityManager->flush();
    }
}