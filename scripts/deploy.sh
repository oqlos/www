#!/bin/bash
# OqlOS Portal Deployment Script
# Usage: ./scripts/deploy.sh [staging|production] [version]

set -e

ENV=${1:-staging}
VERSION=${2:-latest}
COMPOSE_FILE="infra/docker/prod/docker-compose.prod.yml"

echo "🚀 Deploying OqlOS Portal to $ENV (version: $VERSION)"

# Validate environment
if [[ ! "$ENV" =~ ^(staging|production)$ ]]; then
    echo "❌ Error: Environment must be 'staging' or 'production'"
    exit 1
fi

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose required"; exit 1; }

# Export version for compose
export VERSION

# Database backup (production only)
if [ "$ENV" == "production" ]; then
    echo "💾 Creating database backup..."
    mkdir -p backup
    docker exec oqlos-postgres pg_dump -U "${DB_USER:-oqlos}" oqlos > "backup/pre-deploy-$(date +%Y%m%d-%H%M%S).sql" 2>/dev/null || echo "⚠️ Could not backup (container may not exist)"
fi

# Pull latest images
echo "⬇️ Pulling images..."
docker-compose -f "$COMPOSE_FILE" pull

# Rolling update
echo "🔄 Rolling update..."
docker-compose -f "$COMPOSE_FILE" up -d

# Health check
echo "🏥 Health check..."
for i in {1..30}; do
    if curl -sf https://oqlos.com/api/health >/dev/null 2>&1 || curl -sf http://localhost/api/health >/dev/null 2>&1; then
        echo "✅ Service healthy"
        break
    fi
    echo "⏳ Waiting for service... ($i/30)"
    sleep 2
done

# Cleanup
echo "🧹 Cleanup..."
docker system prune -f --volumes=false

echo "✅ Deployment complete!"
echo ""
echo "Verify at:"
echo "  - Portal: https://oqlos.com"
echo "  - API: https://api.oqlos.com/docs"
echo "  - Health: https://oqlos.com/api/health"
