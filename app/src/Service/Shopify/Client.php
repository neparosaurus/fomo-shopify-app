<?php

namespace App\Service\Shopify;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use Symfony\Component\Config\Definition\Exception\Exception;

class Client
{
    public function request(string $method, $uri = '', array $options = []): Response
    {
        $client = new \GuzzleHttp\Client();

        try {
            $response = $client->request($method, $uri, $options);
        }
        catch (RequestException $e) {
            throw new Exception($e->getMessage());
        } catch (GuzzleException $e) {
            throw new Exception($e->getMessage());
        }

        return new Response($response);
    }
}