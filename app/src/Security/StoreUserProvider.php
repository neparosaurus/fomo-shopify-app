<?php

namespace App\Security;

use App\Entity\Store;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class StoreUserProvider implements UserProviderInterface
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em,)
    {
        $this->em = $em;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $store = $this->em
            ->getRepository(Store::class)
            ->findOneBy(['host' => $identifier]);

        if (!$store) {
            throw new UserNotFoundException(sprintf('Host "%s" does not exist.', $identifier));
        }

        return $store;
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return $class === Store::class;
    }
}