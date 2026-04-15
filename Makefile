# OqlOS Portal - Makefile
.PHONY: help dev build preview test test-e2e test-unit clean install lint deploy ansible-test ansible-deploy analyze docker-build docker-run dev-docker dev-docker-down prod prod-down

# Default target
help:
	@echo "OqlOS Portal - Available commands:"
	@echo "  make dev          - Start development server (npm)"
	@echo "  make dev-docker   - Start development server (Docker)"
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
	docker compose -f infra/docker/dev/docker-compose.dev.yml up -d

dev-docker-down:
	docker compose -f infra/docker/dev/docker-compose.dev.yml down

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
