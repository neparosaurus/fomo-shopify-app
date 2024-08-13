<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::BIGINT)]
    private ?string $orderId = null;

    #[ORM\Column(length: 255)]
    #[Groups(['order'])]
    private ?string $customerName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['order'])]
    private ?string $location = null;

    #[ORM\Column(length: 255)]
    #[Groups(['order'])]
    private ?string $productTitle = null;

    #[ORM\Column(length: 255)]
    #[Groups(['order'])]
    private ?string $productHandle = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['order'])]
    private ?Store $store = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['order'])]
    private ?string $productImage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrderId(): ?string
    {
        return $this->orderId;
    }

    public function setOrderId(?string $orderId): void
    {
        $this->orderId = $orderId;
    }

    public function getCustomerName(): ?string
    {
        return $this->customerName;
    }

    public function setCustomerName(?string $customerName): void
    {
        $this->customerName = $customerName;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): void
    {
        $this->location = $location;
    }

    public function getProductTitle(): ?string
    {
        return $this->productTitle;
    }

    public function setProductTitle(?string $productTitle): void
    {
        $this->productTitle = $productTitle;
    }

    public function getStore(): ?Store
    {
        return $this->store;
    }

    public function setStore(?Store $store): static
    {
        $this->store = $store;

        return $this;
    }

    public function getProductHandle(): ?string
    {
        return $this->productHandle;
    }

    public function setProductHandle(string $productHandle): static
    {
        $this->productHandle = $productHandle;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable|string $createdAt): void
    {
        if (is_string($createdAt)) {
            $createdAt = new \DateTimeImmutable($createdAt);
        }

        $this->createdAt = $createdAt;
    }

    #[Groups(['order'])]
    public function getCreatedAtAgo()
    {
        $now = new \DateTimeImmutable();
        $interval = $now->diff($this->createdAt);
        $boughtAt = 'bought ';

        if ($interval->y > 0) {
            $boughtAt .= $interval->y . ' year' . ($interval->y > 1 ? 's' : '') . ' ago';
        }
        elseif ($interval->m > 0) {
            $boughtAt .= $interval->m . ' month' . ($interval->m > 1 ? 's' : '') . ' ago';
        }
        elseif ($interval->d > 0) {
            $boughtAt .= $interval->d . ' day' . ($interval->d > 1 ? 's' : '') . ' ago';
        }
        elseif ($interval->h > 0) {
            $boughtAt .= $interval->h . ' hour' . ($interval->h > 1 ? 's' : '') . ' ago';
        /*}
        elseif ($interval->i > 0) {
            $boughtAt .= $interval->i . ' minute' . ($interval->i > 1 ? 's' : '') . ' ago';*/
        } else {
            $boughtAt = 'just bought';
        }

        return $boughtAt;
    }

    public function getProductImage(): ?string
    {
        return $this->productImage;
    }

    public function setProductImage(?string $productImage): static
    {
        $this->productImage = $productImage;

        return $this;
    }
}
