<?php

namespace App\Controller\API;

use App\Repository\ConfigurationRepository;
use App\Service\Shopify\Context;

class ConfigurationController
{
    private ConfigurationRepository $configurationRepository;

    private function  __construct(ConfigurationRepository $configurationRepository)
    {
        Context::initialize();
        $this->configurationRepository = $configurationRepository;
    }
}