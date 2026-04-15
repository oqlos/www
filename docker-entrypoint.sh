#!/bin/sh
set -e

# Start nginx directly (no envsubst needed for mock mode)
exec nginx -g 'daemon off;'
