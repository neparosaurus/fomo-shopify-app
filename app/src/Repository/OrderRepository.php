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

    public function getWithMinutesLimit(Store $store, int $minutes, array $valuesToFetch): array
    {
        $now = new \DateTimeImmutable();
        $timeLimit = $now->modify("-$minutes minutes");
        $selectFields = $this->buildSelectFields($valuesToFetch);

        return $this->createQueryBuilder('o')
            ->select($selectFields)
            ->andWhere('o.store = :store')
            ->andWhere('o.createdAt >= :timeLimit')
            ->setParameter('store', $store)
            ->setParameter('timeLimit', $timeLimit)
            ->orderBy('o.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function getWithOrdersLimit(Store $store, int $limit, array $valuesToFetch): array
    {
        $selectFields = $this->buildSelectFields($valuesToFetch);

        return $this->createQueryBuilder('o')
            ->select($selectFields)
            ->andWhere('o.store = :store')
            ->setParameter('store', $store)
            ->orderBy('o.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function removeAll(Store $store)
    {
        $orders = $this->createQueryBuilder('o')
            ->where('o.store = :store')
            ->setParameter('store', $store)
            ->getQuery()
            ->getResult();

        $em = $this->getEntityManager();

        foreach ($orders as $order) {
            $em->remove($order);
        }

        $em->flush();
    }

    private function buildSelectFields(array $valuesToFetch): string
    {
        $fieldMap = [
            'customerName' => 'o.customerName',
            'location' => 'o.location',
            'productTitle' => 'o.productTitle',
            'productHandle' => 'o.productHandle',
            'productImage' => 'o.productImage',
            'createdAt' => 'o.createdAt',
        ];

        $selectFields = [];
        foreach ($valuesToFetch as $value) {
            if (isset($fieldMap[$value])) {
                $selectFields[] = $fieldMap[$value];
            }
        }

        if (empty($selectFields)) {
            return 'o';
        }

        return implode(', ', $selectFields);
    }
}
