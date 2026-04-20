# OqlOS Portal - Makefile
.PHONY: help dev build preview test test-e2e test-unit clean install lint deploy ansible-test ansible-deploy analyze docker-build docker-run dev-docker dev-docker-down dev-open prod prod-down

# Default target
help:
	@echo "OqlOS Portal - Available commands:"
	@echo "  make dev          - Start development server (npm)"
	@echo "  make dev-docker   - Start development server (Docker)"
	@echo "  make dev-open     - Start dev containers and open browser"
	@echo "  make build        - Build for production (npm)"
	@echo "  make preview      - Preview production build"
	@echo "  make install      - Install dependencies"
	@echo "  make test         - Run full test suite (shell)"
	@echo "  make test-e2e     - Run Playwright E2E tests"
	@echo "  make test-unit    - Run unit tests (placeholder)"
	@echo "  make test-ui      - Run E2E tests with UI"
	@echo "  make lint         - Run linter"
	@echo "  make ansible-test - Run Ansible E2E tests"
	@echo "  make ansible-deploy - Deploy with Ansible"
	@echo "  make analyze      - Run code analysis (project.sh)"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make clean-all    - Clean everything including node_modules"
	@echo "  make docker-build - Build Docker image"
	@echo "  make dev-docker   - Start dev stack (Traefik + API + Portal)"
	@echo "  make prod  - Start prod stack (HTTPS + Let's Encrypt)"

# Development
dev:
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  Port Configuration (from .env)"
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  VITE_DEV_PORT:      $$(grep VITE_DEV_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_NGINX_PORT:    $$(grep VITE_NGINX_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_TRAEFIK_PORT:  $$(grep VITE_TRAEFIK_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_API_PORT:      $$(grep VITE_API_PORT .env | cut -d'=' -f2)"
	@echo ""
	@echo "  Starting Vite dev server on port $$(grep VITE_DEV_PORT .env | cut -d'=' -f2)"
	@echo "══════════════════════════════════════════════════════════════"
	@echo ""
	npm run dev

build:
	npm run build

preview:
	npm run preview

# Dependencies
install:
	npm install

# Testing
test:
	bash test.sh

test-e2e:
	npx playwright test

test-e2e-ci:
	npx playwright test --project=chromium --reporter=line

test-unit:
	npm run test:unit

test-ui:
	npm run test:e2e:ui

# Code quality
lint:
	npm run lint

security-audit:
	npm audit --audit-level moderate

# Ansible
deploy:
	ansible-playbook -i ansible/inventory.ini ansible/playbook-deploy.yml

ansible-test:
	ansible-playbook -i ansible/inventory.ini ansible/playbook-test.yml

ansible-deploy:
	ansible-playbook -i ansible/inventory.ini ansible/playbook-deploy.yml

# Analysis tools
analyze:
	bash project.sh

# Cleanup
clean:
	rm -rf dist/
	rm -rf test-results/
	rm -rf playwright-report/
	rm -rf project/

clean-all: clean
	rm -rf node_modules/
	rm -rf venv/

# CI/CD pipeline targets
ci: install lint build test-e2e-ci security-audit

# Docker support
docker-build:
	docker build -t oqlos-portal:latest .

docker-run:
	docker run -p 80:80 -e NGINX_PORT=80 -e BACKEND_URL=http://host.docker.internal:8101 oqlos-portal:latest

dev-docker:
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  Port Configuration (from .env)"
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  VITE_DEV_PORT:      $$(grep VITE_DEV_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_NGINX_PORT:    $$(grep VITE_NGINX_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_TRAEFIK_PORT:  $$(grep VITE_TRAEFIK_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_API_PORT:      $$(grep VITE_API_PORT .env | cut -d'=' -f2)"
	@echo ""
	@echo "  Domain Configuration (from .env)"
	@echo "  ─────────────────────────────────────────────────────────"
	@echo "  DOCKER_DOMAIN_PORTAL:   $$(grep DOCKER_DOMAIN_PORTAL .env | cut -d'=' -f2)"
	@echo "  DOCKER_DOMAIN_TRAEFIK:  $$(grep DOCKER_DOMAIN_TRAEFIK .env | cut -d'=' -f2)"
	@echo "  DOCKER_DOMAIN_MAILPIT:  $$(grep DOCKER_DOMAIN_MAILPIT .env | cut -d'=' -f2)"
	@echo "  DOCKER_DOMAIN_CQL:      $$(grep DOCKER_DOMAIN_CQL .env | cut -d'=' -f2)"
	@echo ""
	@echo "  Docker Port Mappings:"
	@echo "  ─────────────────────────────────────────────────────────"
	@echo "    Traefik Dashboard:  8081 → 8080 (container)"
	@echo "    Portal (HTTP):        80 → 80 (container)"
	@echo "    Portal (Direct):      8090 → 80 (container)"
	@echo "══════════════════════════════════════════════════════════════"
	@echo ""
	@echo "Restarting dev Docker stack..."
	docker compose -f infra/docker/dev/docker-compose.dev.yml --env-file .env down
	docker compose -f infra/docker/dev/docker-compose.dev.yml --env-file .env up -d --build
	@echo ""
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  Services available at:"
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  🌐 Portal:        http://$$(grep DOCKER_DOMAIN_PORTAL .env | cut -d'=' -f2)"
	@echo "  📊 Traefik:       http://$$(grep DOCKER_DOMAIN_TRAEFIK .env | cut -d'=' -f2) (port 8081)"
	@echo "  📧 Mailpit:       http://$$(grep DOCKER_DOMAIN_MAILPIT .env | cut -d'=' -f2)"
	@echo ""
	@echo "  External Services:"
	@echo "  ⚙️  CQL Editor:    http://$$(grep DOCKER_DOMAIN_CQL .env | cut -d'=' -f2) (run separately in /cql)"
	@echo "══════════════════════════════════════════════════════════════"
	@echo "Dev Docker stack restarted"

dev-docker-down:
	docker compose -f infra/docker/dev/docker-compose.dev.yml --env-file .env down

dev-open:
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  OqlOS Portal - Development Environment"
	@echo "══════════════════════════════════════════════════════════════"
	@echo ""
	@echo "  Port Configuration (from .env)"
	@echo "  ─────────────────────────────────────────────────────────"
	@echo "  VITE_DEV_PORT:      $$(grep VITE_DEV_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_NGINX_PORT:    $$(grep VITE_NGINX_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_TRAEFIK_PORT:  $$(grep VITE_TRAEFIK_PORT .env | cut -d'=' -f2)"
	@echo "  VITE_API_PORT:      $$(grep VITE_API_PORT .env | cut -d'=' -f2)"
	@echo ""
	@echo "  Domain Configuration (from .env)"
	@echo "  ─────────────────────────────────────────────────────────"
	@echo "  DOCKER_DOMAIN_PORTAL:   $$(grep DOCKER_DOMAIN_PORTAL .env | cut -d'=' -f2)"
	@echo "  DOCKER_DOMAIN_TRAEFIK:  $$(grep DOCKER_DOMAIN_TRAEFIK .env | cut -d'=' -f2)"
	@echo "  DOCKER_DOMAIN_MAILPIT:  $$(grep DOCKER_DOMAIN_MAILPIT .env | cut -d'=' -f2)"
	@echo "  DOCKER_DOMAIN_CQL:      $$(grep DOCKER_DOMAIN_CQL .env | cut -d'=' -f2)"
	@echo ""
	@echo "  Docker Port Mappings:"
	@echo "  ─────────────────────────────────────────────────────────"
	@echo "    Traefik Dashboard:  8081 → 8080 (container)"
	@echo "    Portal (HTTP):        80 → 80 (container)"
	@echo "    Portal (Direct):      8090 → 80 (container)"
	@echo "══════════════════════════════════════════════════════════════"
	@echo ""
	@echo "Starting Docker containers..."
	@docker compose -f infra/docker/dev/docker-compose.dev.yml --env-file .env up -d --build
	@echo ""
	@echo "Checking /etc/hosts..."
	@grep -q "$$(grep DOCKER_DOMAIN_PORTAL .env | cut -d'=' -f2)" /etc/hosts && echo "✓ Domains already configured" || echo "⚠ Run: echo '127.0.0.1 $$(grep DOCKER_DOMAIN_PORTAL .env | cut -d'=' -f2) $$(grep DOCKER_DOMAIN_TRAEFIK .env | cut -d'=' -f2) $$(grep DOCKER_DOMAIN_MAILPIT .env | cut -d'=' -f2) $$(grep DOCKER_DOMAIN_CQL .env | cut -d'=' -f2) cql.localhost' | sudo tee -a /etc/hosts"
	@echo ""
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  Services available at:"
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  🌐 Portal:        http://$$(grep DOCKER_DOMAIN_PORTAL .env | cut -d'=' -f2)"
	@echo "  📊 Traefik:       http://$$(grep DOCKER_DOMAIN_TRAEFIK .env | cut -d'=' -f2) (port 8081)"
	@echo "  📧 Mailpit:       http://$$(grep DOCKER_DOMAIN_MAILPIT .env | cut -d'=' -f2)"
	@echo ""
	@echo "  External Services:"
	@echo "  ⚙️  CQL Editor:    http://$$(grep DOCKER_DOMAIN_CQL .env | cut -d'=' -f2) (run separately in /cql)"
	@echo "══════════════════════════════════════════════════════════════"
	@echo ""
	@echo "Open in browser: http://$$(grep DOCKER_DOMAIN_PORTAL .env | cut -d'=' -f2)"
	@echo ""
	@echo "To stop containers, run: make dev-docker-down"
	@echo "══════════════════════════════════════════════════════════════"

prod:
	docker compose -f infra/docker/prod/docker-compose.prod.yml up -d

prod-down:
	docker compose -f infra/docker/prod/docker-compose.prod.yml down

# Playwright setup
playwright-install:
	npx playwright install chromium firefox webkit

playwright-deps:
	sudo npx playwright install-deps

# Git helpers
commit:
	git add .
	git commit -m "$(m)"

tag:
	git tag v$(v)
	git push origin v$(v)
