<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class StoreAuthenticator extends AbstractAuthenticator
{
    private StoreUserProvider $storeProvider;
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(StoreUserProvider $storeProvider, JWTTokenManagerInterface $jwtManager)
    {
        $this->storeProvider = $storeProvider;
        $this->jwtManager = $jwtManager;
    }

    public function supports(Request $request): ?bool
    {
        if (($request->isMethod('POST') && $request->getPathInfo() === '/api/token') ||
            $request->headers->has('Authorization')) {
            return true;
        }

        return false;
    }

    public function authenticate(Request $request): Passport
    {
        $credentials = str_replace('Bearer ', '', $request->headers->get('Authorization'));

        if ($credentials) {
            $userIdentifier = $this->storeProvider->loadUserByIdentifier($credentials);
        }
        else {
            $data = json_decode($request->getContent(), true);
            $userIdentifier = $data['host'] ?? '';

            if (null === $userIdentifier) {
                throw new UserNotFoundException('Host is required');
            }
        }

        return new SelfValidatingPassport(
            new UserBadge($userIdentifier, function ($userIdentifier) {
                return $this->storeProvider->loadUserByIdentifier($userIdentifier);
            })
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $store = $token->getUser();

        $jwt = $this->jwtManager->create($store);

        return new Response(json_encode(['token' => $jwt]));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new Response(json_encode($data), Response::HTTP_UNAUTHORIZED);
    }
}
