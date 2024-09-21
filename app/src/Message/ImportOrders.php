<?php

namespace App\Message;

use App\Entity\Store;

class ImportOrders
{
    private Store $store;

    public function __construct(Store $store)
    {
        $this->store = $store;
    }
    
    public function getStore(): Store
    {
        return $this->store;
    }
}