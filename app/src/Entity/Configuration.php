<?php

namespace App\Entity;

use AllowDynamicProperties;
use App\Repository\ConfigurationRepository;
use App\Service\Shopify\Context;
use Doctrine\ORM\Mapping as ORM;

#[AllowDynamicProperties] #[ORM\Entity(repositoryClass: ConfigurationRepository::class)]
class Configuration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $fontFamily = "Arial";

    #[ORM\Column(nullable: true)]
    private ?array $backgroundColor = [
        "alpha" => 0.9,
        "brightness" => 0,
        "hue" => 0,
        "saturation" => 1
    ];

    #[ORM\Column(nullable: true)]
    private ?array $textColor = [
        "alpha" => 1,
        "brightness" => 100,
        "hue" => 0,
        "saturation" => 0
    ];

    #[ORM\Column]
    private ?int $initialDelay = 5000;

    #[ORM\Column]
    private ?int $delay = 5000;

    #[ORM\Column]
    private ?int $duration = 5000;

    #[ORM\Column(length: 7)]
    private ?string $cornerStyle = "rounded";

    #[ORM\OneToOne(targetEntity: Store::class, inversedBy: "configuration")]
    #[ORM\JoinColumn(name: 'store_id', referencedColumnName: 'id')]
    private ?Store $store = null;

    public function __construct()
    {
        $this->store = Context::getStore();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFontFamily(): ?string
    {
        return $this->fontFamily;
    }

    public function setFontFamily(?string $fontFamily): static
    {
        $this->fontFamily = $fontFamily;

        return $this;
    }

    public function getBackgroundColor(): ?array
    {
        return $this->backgroundColor;
    }

    public function setBackgroundColor(?array $backgroundColor): static
    {
        $this->backgroundColor = $backgroundColor;

        return $this;
    }

    public function getTextColor(): ?array
    {
        return $this->textColor;
    }

    public function setTextColor(?array $textColor): static
    {
        $this->textColor = $textColor;

        return $this;
    }

    public function getInitialDelay(): ?int
    {
        return $this->initialDelay;
    }

    public function setInitialDelay(int $initialDelay): static
    {
        $this->initialDelay = $initialDelay;

        return $this;
    }

    public function getDelay(): ?int
    {
        return $this->delay;
    }

    public function setDelay(int $delay): static
    {
        $this->delay = $delay;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getCornerStyle(): ?string
    {
        return $this->cornerStyle;
    }

    public function setCornerStyle(string $cornerStyle): static
    {
        $this->cornerStyle = $cornerStyle;

        return $this;
    }

    public function getStore(): ?Store
    {
        return $this->store;
    }

    public function setStore(Store $store): static
    {
        $this->store = $store;

        return $this;
    }
}
