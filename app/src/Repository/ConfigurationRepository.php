<?php

namespace App\Repository;

use App\Entity\Configuration;
use App\Entity\Store;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Configuration>
 */
class ConfigurationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Configuration::class);
    }

    public function updateConfigurationByStore(Store $store, array $data)
    {
        $qb = $this->createQueryBuilder('c')
            ->update()
            ->set('c.name', ':name')
            ->set('c.value', ':value')
            ->where('c.store = :store')
            ->setParameter('name', $data['name'])
            ->setParameter('value', $data['value'])
            ->setParameter('store', $store);

        return $qb->getQuery()->execute();
    }
}
