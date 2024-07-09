<?php

namespace App\Service\Shopify;

use Psr\Http\Message\ResponseInterface;

class Response
{
    private mixed $body;
    private int $statusCode;
    private ResponseInterface $originalResponse;

    public function __construct(ResponseInterface $response = null)
    {
        if ($response) {
            $this->body = json_decode($response->getBody()->getContents(), true);
            $this->statusCode = $response->getStatusCode();
            $this->originalResponse = $response;
        }
    }

    public function getBody(): mixed
    {
        return $this->body;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function isSuccess(): bool
    {
        return !is_null($this->body);
    }

    public function getOriginalResponse(): ResponseInterface
    {
        return $this->originalResponse;
    }
}