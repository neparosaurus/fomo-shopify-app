<?php

namespace App\Service\Shopify\GraphQL;

class Extension extends Base
{
    public static function createExtension($handle, $title, $type, $configuration = [])
    {
        $query = <<<QUERY
        mutation extensionCreate(\$input: ExtensionCreateInput!) {
            extensionCreate(input: \$input) {
                extension {
                    id
                    handle
                    title
                    type
                }
                userErrors {
                    field
                    message
                }
            }
        }
    QUERY;

        $variables = [
            "input" => [
                "handle" => $handle,
                "title" => $title,
                "type" => $type,
                "configuration" => $configuration
            ]
        ];

        return parent::fetch($query, $variables);
    }
}