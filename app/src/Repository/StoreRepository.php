<?php

namespace App\Repository;

use App\Entity\Store;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Store>
 */
class StoreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Store::class);
    }

    public function add(Store $store, bool $flush = false): void
    {
        $this->getEntityManager()->persist($store);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Store $store, bool $flush = false): void
    {
        $this->getEntityManager()->remove($store);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getByHost(string $host): ?Store
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.configuration', 'c')
            ->addSelect('c')
            ->leftJoin('s.orders', 'o')
            ->addSelect('o')
            ->andWhere('s.host = :host')
            ->setParameter('host', $host)
            ->orderBy('s.id', 'DESC')
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function setStoreInactive(Store $store)
    {
        $store->setIsActive(false);

        $this->getEntityManager()->flush();
    }
}
