<?php

namespace App\Repository;

use App\Entity\Order;
use App\Entity\Store;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Order>
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function getWithMinutesLimit(Store $store, int $minutes): array
    {
        $now = new \DateTimeImmutable();
        $timeLimit = $now->modify("-$minutes minutes");

        return $this->createQueryBuilder('o')
            ->andWhere('o.store = :store')
            ->andWhere('o.createdAt >= :timeLimit')
            ->setParameter('store', $store)
            ->setParameter('timeLimit', $timeLimit)
            ->orderBy('o.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function getWithOrdersLimit(Store $store, int $limit): array
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.store = :store')
            ->setParameter('store', $store)
            ->orderBy('o.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
