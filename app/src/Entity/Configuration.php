<?php

namespace App\Entity;

use AllowDynamicProperties;
use App\Repository\ConfigurationRepository;
use App\Service\Shopify\Context;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[AllowDynamicProperties] #[ORM\Entity(repositoryClass: ConfigurationRepository::class)]
class Configuration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $fontFamily = "default";

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
        "brightness" => 1,
        "hue" => 0,
        "saturation" => 0
    ];

    #[ORM\Column]
    private ?int $initialDelay = 5;

    #[ORM\Column]
    private ?int $delay = 5;

    #[ORM\Column]
    private ?int $duration = 5;

    #[ORM\Column(length: 12)]
    private ?string $position = "bottom-left";

    #[ORM\OneToOne(targetEntity: Store::class, inversedBy: "configuration")]
    #[ORM\JoinColumn(name: 'store_id', referencedColumnName: 'id')]
    private ?Store $store = null;

    /*
     * 0 - Use minutes
     * 1 - Use count
     */
    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $thresholdType = 1;

    #[ORM\Column(nullable: true)]
    private ?int $thresholdMinutes = 0;

    #[ORM\Column(nullable: true)]
    private ?int $thresholdCount = 10;

    #[ORM\Column]
    private ?bool $loopOrders = true;

    #[ORM\Column(length: 4)]
    private ?string $fontSize = "100";

    #[ORM\Column]
    private ?bool $shuffleOrders = false;

    #[ORM\Column(length: 255)]
    private ?string $textContent = "";

    #[ORM\Column]
    private ?int $designTemplateId = 1;

    #[ORM\Column]
    private ?bool $showThumbnail = true;

    #[ORM\Column(length: 5)]
    private ?string $thumbnailPosition = "end";

    #[ORM\Column(length: 3)]
    private ?string $verticalAlignment = "mid";

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $cornerRadius = 0;

    #[ORM\Column]
    private ?bool $rtl = false;

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

    public function getStore(): ?Store
    {
        return $this->store;
    }

    public function setStore(Store $store): static
    {
        $this->store = $store;

        return $this;
    }

    public function getPosition(): ?string
    {
        return $this->position;
    }

    public function setPosition(string $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getThresholdType(): ?int
    {
        return $this->thresholdType;
    }

    public function setThresholdType(int $thresholdType): static
    {
        $this->thresholdType = $thresholdType;

        return $this;
    }

    public function getThresholdMinutes(): ?int
    {
        return $this->thresholdMinutes;
    }

    public function setThresholdMinutes(?int $thresholdMinutes): static
    {
        $this->thresholdMinutes = $thresholdMinutes;

        return $this;
    }

    public function getThresholdCount(): ?int
    {
        return $this->thresholdCount;
    }

    public function setThresholdCount(?int $thresholdCount): static
    {
        $this->thresholdCount = $thresholdCount;

        return $this;
    }

    public function isLoopOrders(): ?bool
    {
        return $this->loopOrders;
    }

    public function setLoopOrders(bool $loopOrders): static
    {
        $this->loopOrders = $loopOrders;

        return $this;
    }

    public function getFontSize(): ?string
    {
        return $this->fontSize;
    }

    public function setFontSize(string $fontSize): static
    {
        $this->fontSize = $fontSize;

        return $this;
    }

    public function isShuffleOrders(): ?bool
    {
        return $this->shuffleOrders;
    }

    public function setShuffleOrders(bool $shuffleOrders): static
    {
        $this->shuffleOrders = $shuffleOrders;

        return $this;
    }

    public function getTextContent(): ?string
    {
        return $this->textContent;
    }

    public function setTextContent(string $textContent): static
    {
        $this->textContent = $textContent;

        return $this;
    }

    public function getDesignTemplateId(): ?int
    {
        return $this->designTemplateId;
    }

    public function setDesignTemplateId(int $designTemplateId): static
    {
        $this->designTemplateId = $designTemplateId;

        return $this;
    }

    public function isShowThumbnail(): ?bool
    {
        return $this->showThumbnail;
    }

    public function setShowThumbnail(bool $showThumbnail): static
    {
        $this->showThumbnail = $showThumbnail;

        return $this;
    }

    public function getThumbnailPosition(): ?string
    {
        return $this->thumbnailPosition;
    }

    public function setThumbnailPosition(string $thumbnailPosition): static
    {
        $this->thumbnailPosition = $thumbnailPosition;

        return $this;
    }

    public function getVerticalAlignment(): ?string
    {
        return $this->verticalAlignment;
    }

    public function setVerticalAlignment(string $verticalAlignment): static
    {
        $this->verticalAlignment = $verticalAlignment;

        return $this;
    }

    public function getCornerRadius(): ?int
    {
        return $this->cornerRadius;
    }

    public function setCornerRadius(int $cornerRadius): static
    {
        $this->cornerRadius = $cornerRadius;

        return $this;
    }

    public function isRtl(): ?bool
    {
        return $this->rtl;
    }

    public function setRtl(bool $rtl): static
    {
        $this->rtl = $rtl;

        return $this;
    }
}
