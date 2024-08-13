#!/bin/bash

# Navigate to your extension directory
cd /app/extensions/

# Build the extension
shopify app build

# Deploy the extension
shopify app deploy