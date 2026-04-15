#!/bin/sh
set -e

# Substitute environment variables in nginx config
envsubst '\$NGINX_PORT \$BACKEND_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
