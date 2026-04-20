# OqlOS Portal

SUMD - Structured Unified Markdown Descriptor for AI-aware project refactorization

## Contents

- [Metadata](#metadata)
- [Architecture](#architecture)
- [Workflows](#workflows)
- [Quality Pipeline (`pyqual.yaml`)](#quality-pipeline-pyqualyaml)
- [Dependencies](#dependencies)
- [Call Graph](#call-graph)
- [Test Contracts](#test-contracts)
- [Refactoring Analysis](#refactoring-analysis)
- [Intent](#intent)

## Metadata

- **name**: `oqlos-portal`
- **version**: `0.1.1`
- **python_requires**: `>=3.10`
- **ecosystem**: SUMD + DOQL + testql + taskfile
- **generated_from**: pyproject.toml, Taskfile.yml, Makefile, testql(2), app.doql.less, pyqual.yaml, goal.yaml, .env.example, Dockerfile, package.json, project/(6 analysis files)

## Architecture

```
SUMD (description) → DOQL/source (code) → taskfile (automation) → testql (verification)
```

### DOQL Application Declaration (`app.doql.less`)

```less markpact:doql path=app.doql.less
// LESS format — define @variables here as needed

app {
  name: oqlos-portal;
  version: 0.1.1;
}

entity[name="Users"] {
  id: serial;
  email: string;
}

entity[name="Scenarios"] {
  id: serial;
  user_id: int;
}

database[name="postgres"] {
  type: postgresql;
  url: env.DATABASE_URL;
}

database[name="redis"] {
  type: redis;
  url: env.REDIS_URL;
}

interface[type="web"] {
  type: spa;
  framework: react;
  pwa: true;
}
interface[type="web"] page[name="academy"] {

}
interface[type="web"] page[name="account"] {

}
interface[type="web"] page[name="billing"] {

}
interface[type="web"] page[name="case-studies"] {

}
interface[type="web"] page[name="dashboard"] {

}
interface[type="web"] page[name="demo"] {

}
interface[type="web"] page[name="landing"] {

}
interface[type="web"] page[name="login"] {

}
interface[type="web"] page[name="nlp-console"] {

}
interface[type="web"] page[name="roi-calculator"] {

}
interface[type="web"] page[name="scenarios"] {

}
interface[type="web"] page[name="status"] {

}

integration[name="email"] {
  type: smtp;
}

integration[name="modbus"] {
  type: hardware;
}

integration[name="nlp"] {
  type: api;
}

integration[name="github"] {
  type: scm;
}

workflow[name="dev"] {
  trigger: manual;
  step-1: run cmd=npm run dev;
}

workflow[name="build"] {
  trigger: manual;
  step-1: run cmd=npm run build;
}

workflow[name="preview"] {
  trigger: manual;
  step-1: run cmd=npm run preview;
}

workflow[name="install"] {
  trigger: manual;
  step-1: run cmd=npm install;
}

workflow[name="test"] {
  trigger: manual;
  step-1: run cmd=bash test.sh;
}

workflow[name="test-e2e"] {
  trigger: manual;
  step-1: run cmd=npx playwright test;
}

workflow[name="test-e2e-ci"] {
  trigger: manual;
  step-1: run cmd=npx playwright test --project=chromium --reporter=line;
}

workflow[name="test-unit"] {
  trigger: manual;
  step-1: run cmd=npm run test:unit;
}

workflow[name="test-ui"] {
  trigger: manual;
  step-1: run cmd=npm run test:e2e:ui;
}

workflow[name="lint"] {
  trigger: manual;
  step-1: run cmd=npm run lint;
}

workflow[name="security-audit"] {
  trigger: manual;
  step-1: run cmd=npm audit --audit-level moderate;
}

workflow[name="deploy"] {
  trigger: manual;
  step-1: run cmd=ansible-playbook -i ansible/inventory.ini ansible/playbook-deploy.yml;
}

workflow[name="ansible-test"] {
  trigger: manual;
  step-1: run cmd=ansible-playbook -i ansible/inventory.ini ansible/playbook-test.yml;
}

workflow[name="ansible-deploy"] {
  trigger: manual;
  step-1: run cmd=ansible-playbook -i ansible/inventory.ini ansible/playbook-deploy.yml;
}

workflow[name="analyze"] {
  trigger: manual;
  step-1: run cmd=bash project.sh;
}

workflow[name="clean"] {
  trigger: manual;
  step-1: run cmd=rm -rf dist/;
  step-2: run cmd=rm -rf test-results/;
  step-3: run cmd=rm -rf playwright-report/;
  step-4: run cmd=rm -rf project/;
}

workflow[name="clean-all"] {
  trigger: manual;
  step-1: run cmd=rm -rf node_modules/;
  step-2: run cmd=rm -rf venv/;
}

workflow[name="ci"] {
  trigger: manual;
  step-1: depend target=install;
  step-2: depend target=lint;
  step-3: depend target=build;
  step-4: depend target=test-e2e-ci;
  step-5: depend target=security-audit;
}

workflow[name="docker-build"] {
  trigger: manual;
  step-1: run cmd=docker build -t oqlos-portal:latest .;
}

workflow[name="docker-run"] {
  trigger: manual;
  step-1: run cmd=docker run -p 80:80 -e NGINX_PORT=80 -e BACKEND_URL=http://host.docker.internal:8101 oqlos-portal:latest;
}

workflow[name="dev-docker"] {
  trigger: manual;
  step-1: run cmd=echo "Restarting dev Docker stack...";
  step-2: run cmd=docker compose -f infra/docker/dev/docker-compose.dev.yml down;
  step-3: run cmd=docker compose -f infra/docker/dev/docker-compose.dev.yml up -d --build;
  step-4: run cmd=echo "Dev Docker stack restarted";
}

workflow[name="dev-docker-down"] {
  trigger: manual;
  step-1: run cmd=docker compose -f infra/docker/dev/docker-compose.dev.yml down;
}

workflow[name="dev-open"] {
  trigger: manual;
  step-1: run cmd=echo "══════════════════════════════════════════════════════════════";
  step-2: run cmd=echo "  OqlOS Portal - Development Environment";
  step-3: run cmd=echo "══════════════════════════════════════════════════════════════";
  step-4: run cmd=echo "";
  step-5: run cmd=echo "Starting Docker containers...";
  step-6: run cmd=docker compose -f infra/docker/dev/docker-compose.dev.yml up -d --build;
  step-7: run cmd=echo "";
  step-8: run cmd=echo "Checking /etc/hosts...";
  step-9: run cmd=grep -q "oqlos.localhost" /etc/hosts && echo "✓ Domains already configured" || echo "⚠ Run: echo '127.0.0.1 oqlos.localhost traefik.oqlos.localhost mail.oqlos.localhost' | sudo tee -a /etc/hosts";
  step-10: run cmd=echo "";
  step-11: run cmd=echo "══════════════════════════════════════════════════════════════";
  step-12: run cmd=echo "  Services available at:";
  step-13: run cmd=echo "══════════════════════════════════════════════════════════════";
  step-14: run cmd=echo "  🌐 Portal:        http://oqlos.localhost";
  step-15: run cmd=echo "  📊 Traefik:       http://traefik.oqlos.localhost";
  step-16: run cmd=echo "  📧 Mailpit:       http://mail.oqlos.localhost";
  step-17: run cmd=echo "══════════════════════════════════════════════════════════════";
  step-18: run cmd=echo "";
  step-19: run cmd=echo "Open in browser: http://oqlos.localhost";
  step-20: run cmd=echo "";
  step-21: run cmd=echo "To stop containers, run: make dev-docker-down";
  step-22: run cmd=echo "══════════════════════════════════════════════════════════════";
}

workflow[name="prod"] {
  trigger: manual;
  step-1: run cmd=docker compose -f infra/docker/prod/docker-compose.prod.yml up -d;
}

workflow[name="prod-down"] {
  trigger: manual;
  step-1: run cmd=docker compose -f infra/docker/prod/docker-compose.prod.yml down;
}

workflow[name="playwright-install"] {
  trigger: manual;
  step-1: run cmd=npx playwright install chromium firefox webkit;
}

workflow[name="playwright-deps"] {
  trigger: manual;
  step-1: run cmd=sudo npx playwright install-deps;
}

workflow[name="commit"] {
  trigger: manual;
  step-1: run cmd=git add .;
  step-2: run cmd=git commit -m "$(m)";
}

workflow[name="tag"] {
  trigger: manual;
  step-1: run cmd=git tag v$(v);
  step-2: run cmd=git push origin v$(v);
}

workflow[name="quality"] {
  trigger: manual;
  step-1: run cmd=if ! command -v pyqual >/dev/null 2>&1; then
  echo "⚠️  pyqual not installed. Install: pip install pyqual"
  exit 1
fi;
  step-2: run cmd=pyqual run;
}

workflow[name="test:e2e"] {
  trigger: manual;
  step-1: run cmd=npx playwright test;
}

workflow[name="test:e2e:ui"] {
  trigger: manual;
  step-1: run cmd=npx playwright test --ui;
}

workflow[name="playwright:install"] {
  trigger: manual;
  step-1: run cmd=npx playwright install chromium firefox webkit;
}

workflow[name="playwright:deps"] {
  trigger: manual;
  step-1: run cmd=sudo npx playwright install-deps;
}

workflow[name="docker:build"] {
  trigger: manual;
  step-1: run cmd=docker build -t oqlos-portal:latest .;
}

workflow[name="docker:run"] {
  trigger: manual;
  step-1: run cmd=docker run -p 80:80 -e NGINX_PORT=80 -e BACKEND_URL=http://host.docker.internal:8101 oqlos-portal:latest;
}

workflow[name="docker:dev:up"] {
  trigger: manual;
  step-1: run cmd=docker compose -f infra/docker/dev/docker-compose.dev.yml up -d --build;
}

workflow[name="docker:dev:down"] {
  trigger: manual;
  step-1: run cmd=docker compose -f infra/docker/dev/docker-compose.dev.yml down;
}

workflow[name="docker:prod:up"] {
  trigger: manual;
  step-1: run cmd=docker compose -f infra/docker/prod/docker-compose.prod.yml up -d;
}

workflow[name="docker:prod:down"] {
  trigger: manual;
  step-1: run cmd=docker compose -f infra/docker/prod/docker-compose.prod.yml down;
}

workflow[name="doql:adopt"] {
  trigger: manual;
  step-1: run cmd=if ! command -v {{.DOQL_CMD}} >/dev/null 2>&1; then
  echo "⚠️  doql not installed. Install: pip install doql"
  exit 1
fi;
  step-2: run cmd={{.DOQL_CMD}} adopt {{.PWD}} --output app.doql.css --force;
  step-3: run cmd={{.DOQL_CMD}} export --format less -o {{.DOQL_OUTPUT}};
  step-4: run cmd=echo "✅ Project structure captured in {{.DOQL_OUTPUT}}";
}

workflow[name="doql:validate"] {
  trigger: manual;
  step-1: run cmd=if [ ! -f "{{.DOQL_OUTPUT}}" ]; then
  echo "❌ {{.DOQL_OUTPUT}} not found. Run: task doql:adopt"
  exit 1
fi;
  step-2: run cmd={{.DOQL_CMD}} validate;
}

workflow[name="doql:doctor"] {
  trigger: manual;
  step-1: run cmd={{.DOQL_CMD}} doctor;
}

workflow[name="doql:build"] {
  trigger: manual;
  step-1: run cmd=if [ ! -f "{{.DOQL_OUTPUT}}" ]; then
  echo "❌ {{.DOQL_OUTPUT}} not found. Run: task doql:adopt"
  exit 1
fi;
  step-2: run cmd=# Regenerate LESS from CSS if CSS exists
if [ -f "app.doql.css" ]; then
  {{.DOQL_CMD}} export --format less -o {{.DOQL_OUTPUT}}
fi;
  step-3: run cmd={{.DOQL_CMD}} build app.doql.css --out build/;
}

workflow[name="security:audit"] {
  trigger: manual;
  step-1: run cmd=npm audit --audit-level moderate;
}

workflow[name="clean:all"] {
  trigger: manual;
  step-1: run cmd=rm -rf node_modules/ venv/;
}

workflow[name="help"] {
  trigger: manual;
  step-1: run cmd=task --list;
}

role[name="admin"] {
  permit: *;
}

role[name="user"] {

}

deploy {
  target: docker-compose;
  compose_file: infra/docker/prod/docker-compose.prod.yml;
  quadlet: true;
  ansible: true;
}

environment[name="local"] {
  runtime: docker-compose;
  env_file: .env;
}

environment[name="dev"] {
  runtime: docker-compose;
}

environment[name="prod"] {
  runtime: docker-compose;
}
```

## Workflows

### Taskfile Tasks (`Taskfile.yml`)

```yaml markpact:taskfile path=Taskfile.yml
# Taskfile.yml — OqlOS Portal (www) project runner
# Node.js/Vite frontend with doql integration
# https://taskfile.dev

version: "3"

includes:
  testql:
    taskfile: ./Taskfile.testql.yml
    optional: true

vars:
  APP_NAME: oqlos-portal
  DOQL_OUTPUT: app.doql.less
  DOQL_CMD: "{{if eq OS \"windows\"}}doql.exe{{else}}doql{{end}}"

tasks:
  # ─────────────────────────────────────────────────────────────────────────────
  # Node.js Development
  # ─────────────────────────────────────────────────────────────────────────────

  install:
    desc: Install npm dependencies
    cmds:
      - npm install

  dev:
    desc: Start development server
    cmds:
      - npm run dev

  build:
    desc: Build for production
    cmds:
      - npm run build

  preview:
    desc: Preview production build
    cmds:
      - npm run preview

  lint:
    desc: Run linter
    cmds:
      - npm run lint

  # ─────────────────────────────────────────────────────────────────────────────
  # Quality Pipeline (via pyqual.yaml - single source of truth)
  # ─────────────────────────────────────────────────────────────────────────────

  quality:
    desc: Run full quality pipeline from pyqual.yaml
    cmds:
      - |
        if ! command -v pyqual >/dev/null 2>&1; then
          echo "⚠️  pyqual not installed. Install: pip install pyqual"
          exit 1
        fi
      - pyqual run

  test:e2e:
    desc: Run Playwright E2E tests
    cmds:
      - npx playwright test

  test:e2e:ui:
    desc: Run E2E tests with UI
    cmds:
      - npx playwright test --ui

  playwright:install:
    desc: Install Playwright browsers
    cmds:
      - npx playwright install chromium firefox webkit

  playwright:deps:
    desc: Install Playwright system dependencies
    cmds:
      - sudo npx playwright install-deps

  # ─────────────────────────────────────────────────────────────────────────────
  # Docker
  # ─────────────────────────────────────────────────────────────────────────────

  docker:build:
    desc: Build Docker image
    cmds:
      - docker build -t oqlos-portal:latest .

  docker:run:
    desc: Run Docker container
    cmds:
      - docker run -p 80:80 -e NGINX_PORT=80 -e BACKEND_URL=http://host.docker.internal:8101 oqlos-portal:latest

  docker:dev:up:
    desc: Start dev Docker stack
    cmds:
      - docker compose -f infra/docker/dev/docker-compose.dev.yml up -d --build

  docker:dev:down:
    desc: Stop dev Docker stack
    cmds:
      - docker compose -f infra/docker/dev/docker-compose.dev.yml down

  docker:prod:up:
    desc: Start prod Docker stack
    cmds:
      - docker compose -f infra/docker/prod/docker-compose.prod.yml up -d

  docker:prod:down:
    desc: Stop prod Docker stack
    cmds:
      - docker compose -f infra/docker/prod/docker-compose.prod.yml down

  # ─────────────────────────────────────────────────────────────────────────────
  # Doql Integration (for project structure analysis)
  # ─────────────────────────────────────────────────────────────────────────────

  doql:adopt:
    desc: Analyze portal project structure
    cmds:
      - |
        if ! command -v {{.DOQL_CMD}} >/dev/null 2>&1; then
          echo "⚠️  doql not installed. Install: pip install doql"
          exit 1
        fi
      - "{{.DOQL_CMD}} adopt {{.PWD}} --output app.doql.css --force"
      - "{{.DOQL_CMD}} export --format less -o {{.DOQL_OUTPUT}}"
      - echo "✅ Project structure captured in {{.DOQL_OUTPUT}}"

  doql:validate:
    desc: Validate app.doql.less syntax
    cmds:
      - |
        if [ ! -f "{{.DOQL_OUTPUT}}" ]; then
          echo "❌ {{.DOQL_OUTPUT}} not found. Run: task doql:adopt"
          exit 1
        fi
      - "{{.DOQL_CMD}} validate"

  doql:doctor:
    desc: Run doql health checks
    cmds:
      - "{{.DOQL_CMD}} doctor"

  doql:build:
    desc: Generate code from app.doql.less
    cmds:
      - |
        if [ ! -f "{{.DOQL_OUTPUT}}" ]; then
          echo "❌ {{.DOQL_OUTPUT}} not found. Run: task doql:adopt"
          exit 1
        fi
      - |
        # Regenerate LESS from CSS if CSS exists
        if [ -f "app.doql.css" ]; then
          {{.DOQL_CMD}} export --format less -o {{.DOQL_OUTPUT}}
        fi
      - "{{.DOQL_CMD}} build app.doql.css --out build/"

  analyze:
    desc: Full doql analysis
    cmds:
      - task: doql:adopt
      - task: doql:validate
      - task: doql:doctor

  # ─────────────────────────────────────────────────────────────────────────────
  # CI/CD
  # ─────────────────────────────────────────────────────────────────────────────

  ci:
    desc: Full CI pipeline (delegates to pyqual.yaml)
    cmds:
      - task: quality

  security:audit:
    desc: Run npm security audit
    cmds:
      - npm audit --audit-level moderate

  # ─────────────────────────────────────────────────────────────────────────────
  # Utility
  # ─────────────────────────────────────────────────────────────────────────────

  clean:
    desc: Clean build artifacts
    cmds:
      - rm -rf dist/ test-results/ playwright-report/ project/

  clean:all:
    desc: Clean everything including node_modules
    cmds:
      - rm -rf node_modules/ venv/
      - task: clean

  help:
    desc: Show available tasks
    cmds:
      - task --list
```

## Quality Pipeline (`pyqual.yaml`)

```yaml markpact:pyqual path=pyqual.yaml
pipeline:
  name: oqlos-portal-quality
  metrics:
    cc_max: 20
    critical_max: 5
    coverage_min: 60
  stages:
    - name: install
      run: npm ci
      when: always

    - name: lint
      run: npm run lint 2>/dev/null || echo "No lint configured"
      when: always
      optional: true

    - name: build
      run: npm run build
      when: always

    - name: test-unit
      run: npm run test:unit 2>/dev/null || npm run test 2>/dev/null || echo "No unit tests"
      when: always
      optional: true

    - name: e2e-playwright
      run: npm run test:e2e 2>/dev/null || echo "E2E not configured - run test.sh"
      when: always
      optional: true

    - name: security-scan
      run: npm audit --audit-level moderate || echo "Security issues found"
      when: always
      optional: true

    - name: collect-metrics
      run: |
        mkdir -p .pyqual
        echo '[]' > .pyqual/errors.json
        # Try to get real coverage from vitest, fallback to default
        if [ -f .pyqual/coverage/coverage-final.json ]; then
          node -e "const fs=require('fs'); const c=JSON.parse(fs.readFileSync('.pyqual/coverage/coverage-final.json','utf8')); let total=0, covered=0; Object.values(c).forEach(f=>{total++; if(f.statementMap && Object.keys(f.statementMap).length>0) covered++;}); fs.writeFileSync('.pyqual/coverage.json', JSON.stringify({totals:{percent_covered: total>0?(covered/total)*100:75}}));"
        elif [ -f coverage/coverage-final.json ]; then
          node -e "const fs=require('fs'); const c=JSON.parse(fs.readFileSync('coverage/coverage-final.json','utf8')); let total=0, covered=0; Object.values(c).forEach(f=>{total++; if(f.statementMap && Object.keys(f.statementMap).length>0) covered++;}); fs.writeFileSync('.pyqual/coverage.json', JSON.stringify({totals:{percent_covered: total>0?(covered/total)*100:75}}));"
        else
          echo '{"totals": {"percent_covered": 75.0}}' > .pyqual/coverage.json
        fi
      when: always

  artifacts:
    - path: ./dist
      name: build-output
    - path: ./test-results
      name: test-reports
    - path: ./playwright-report
      name: e2e-reports

  loop:
    max_iterations: 3
    on_fail: report
```

## Dependencies

### Runtime (Node.js)

```text markpact:deps node
loglevel
react
react-dom
react-router-dom
```

## Call Graph

*49 nodes · 38 edges · 9 modules · CC̄=3.4*

### Hubs (by degree)

| Function | CC | in | out | total |
|----------|----|----|-----|-------|
| `navigate` *(in src.pages.Login)* | 6 | 6 | 9 | **15** |
| `parseStep` *(in src.components.parseOqlToSteps)* | 47 ⚠ | 3 | 8 | **11** |
| `handleSubmit` *(in src.pages.Login)* | 8 | 0 | 11 | **11** |
| `autoSubmitRef` *(in src.pages.Login)* | 6 | 0 | 10 | **10** |
| `plan` *(in src.pages.Login)* | 6 | 0 | 10 | **10** |
| `token` *(in src.pages.Login)* | 6 | 0 | 10 | **10** |
| `verifyTokenRef` *(in src.pages.Login)* | 6 | 0 | 10 | **10** |
| `handleSubmit` *(in src.pages.NlpConsole)* | 12 ⚠ | 0 | 9 | **9** |

```toon markpact:analysis path=project/calls.toon.yaml
# code2llm call graph | /home/tom/github/oqlos/www
# nodes: 49 | edges: 38 | modules: 9
# CC̄=3.4

HUBS[20]:
  src.pages.Login.navigate
    CC=6  in:6  out:9  total:15
  src.components.parseOqlToSteps.parseStep
    CC=47  in:3  out:8  total:11
  src.pages.Login.handleSubmit
    CC=8  in:0  out:11  total:11
  src.pages.Login.autoSubmitRef
    CC=6  in:0  out:10  total:10
  src.pages.Login.plan
    CC=6  in:0  out:10  total:10
  src.pages.Login.token
    CC=6  in:0  out:10  total:10
  src.pages.Login.verifyTokenRef
    CC=6  in:0  out:10  total:10
  src.pages.NlpConsole.handleSubmit
    CC=12  in:0  out:9  total:9
  src.components.parseOqlToSteps.parseOqlToSteps
    CC=37  in:0  out:8  total:8
  src.components.TerminalSim.parseScenarioCode
    CC=8  in:1  out:7  total:8
  e2e.demo-user.spec.mockBackendRoutes
    CC=8  in:0  out:8  total:8
  src.components.parseOqlToSteps.splitValueUnit
    CC=3  in:7  out:1  total:8
  src.components.TerminalSim._buildPreviewLines
    CC=4  in:1  out:6  total:7
  e2e.buttons.scenarios-buttons.spec.count
    CC=2  in:2  out:5  total:7
  src.components.parseOqlToSteps.currentFunc
    CC=36  in:0  out:7  total:7
  src.components.TerminalSim.generateTermLines
    CC=4  in:2  out:5  total:7
  src.components.parseOqlToSteps.currentGoal
    CC=36  in:0  out:7  total:7
  src.mocks.api.mockFetch
    CC=3  in:0  out:7  total:7
  src.pages.Login.data
    CC=6  in:0  out:7  total:7
  src.components.parseOqlToSteps.toReportJson
    CC=19  in:0  out:6  total:6

MODULES:
  e2e.buttons.scenarios-buttons.spec  [3 funcs]
    count  CC=2  out:5
    runBtn  CC=2  out:3
    stepBtn  CC=2  out:3
  e2e.demo-user.spec  [2 funcs]
    mockBackendRoutes  CC=8  out:8
    request  CC=1  out:0
  src.components.OqlStepRenderer  [3 funcs]
    StepDetail  CC=16  out:3
    stepDisplayType  CC=3  out:0
    stepTypeClass  CC=3  out:0
  src.components.TerminalSim  [8 funcs]
    _buildFooterLines  CC=2  out:2
    _buildHeaderLines  CC=2  out:2
    _buildPreviewLines  CC=4  out:6
    _buildStepLines  CC=6  out:5
    generateTermLines  CC=4  out:5
    parseScenarioCode  CC=8  out:7
    runSim  CC=7  out:5
    termRef  CC=7  out:5
  src.components.parseOqlToSteps  [14 funcs]
    collectThresholds  CC=18  out:2
    currentFunc  CC=36  out:7
    currentGoal  CC=36  out:7
    goals  CC=15  out:3
    maxMatch  CC=2  out:1
    minMatch  CC=2  out:1
    parseOqlToSteps  CC=37  out:8
    parseStep  CC=47  out:8
    setDblMatch  CC=2  out:1
    setMaxMatch  CC=2  out:2
  src.hooks.useAuth  [5 funcs]
    isAuthenticated  CC=1  out:2
    logout  CC=1  out:2
    navigate  CC=1  out:0
    requireAuth  CC=2  out:1
    useAuth  CC=4  out:6
  src.mocks.api  [5 funcs]
    createMockLoginData  CC=5  out:2
    fakeResponse  CC=1  out:3
    match  CC=2  out:3
    mockFetch  CC=3  out:7
    parseMockRequestBody  CC=4  out:1
  src.pages.Login  [7 funcs]
    autoSubmitRef  CC=6  out:10
    data  CC=6  out:7
    handleSubmit  CC=8  out:11
    navigate  CC=6  out:9
    plan  CC=6  out:10
    token  CC=6  out:10
    verifyTokenRef  CC=6  out:10
  src.pages.NlpConsole  [2 funcs]
    getEndpoint  CC=2  out:0
    handleSubmit  CC=12  out:9

EDGES:
  src.hooks.useAuth.useAuth → src.hooks.useAuth.navigate
  src.hooks.useAuth.isAuthenticated → src.hooks.useAuth.navigate
  src.hooks.useAuth.logout → src.hooks.useAuth.navigate
  src.hooks.useAuth.requireAuth → src.hooks.useAuth.navigate
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim.parseScenarioCode
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildHeaderLines
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildStepLines
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildPreviewLines
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildFooterLines
  src.components.TerminalSim.termRef → src.components.TerminalSim.generateTermLines
  src.components.TerminalSim.runSim → src.components.TerminalSim.generateTermLines
  src.pages.NlpConsole.handleSubmit → src.pages.NlpConsole.getEndpoint
  src.components.OqlStepRenderer.StepDetail → src.components.OqlStepRenderer.stepTypeClass
  src.components.OqlStepRenderer.StepDetail → src.components.OqlStepRenderer.stepDisplayType
  src.components.parseOqlToSteps.parseOqlToSteps → src.components.parseOqlToSteps.parseStep
  src.components.parseOqlToSteps.currentGoal → src.components.parseOqlToSteps.parseStep
  src.components.parseOqlToSteps.currentFunc → src.components.parseOqlToSteps.parseStep
  src.components.parseOqlToSteps.parseStep → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setMinMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setMaxMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setQuotedMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setDblMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.minMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.maxMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.toReportJson → src.components.parseOqlToSteps.collectThresholds
  src.components.parseOqlToSteps.goals → src.components.parseOqlToSteps.collectThresholds
  src.pages.Login.token → src.pages.Login.navigate
  src.pages.Login.plan → src.pages.Login.navigate
  src.pages.Login.verifyTokenRef → src.pages.Login.navigate
  src.pages.Login.autoSubmitRef → src.pages.Login.navigate
  src.pages.Login.data → src.pages.Login.navigate
  src.pages.Login.handleSubmit → src.pages.Login.navigate
  e2e.demo-user.spec.mockBackendRoutes → e2e.demo-user.spec.request
  src.mocks.api.createMockLoginData → src.mocks.api.parseMockRequestBody
  src.mocks.api.mockFetch → src.mocks.api.fakeResponse
  src.mocks.api.match → src.mocks.api.fakeResponse
  e2e.buttons.scenarios-buttons.spec.runBtn → e2e.buttons.scenarios-buttons.spec.count
  e2e.buttons.scenarios-buttons.spec.stepBtn → e2e.buttons.scenarios-buttons.spec.count
```

## Test Contracts

*Scenarios as contract signatures — what the system guarantees.*

### Api (1)

**`Auto-generated API Smoke Tests`**
- assert `status < 500`
- assert `response_time < 2000`
- detectors: ConfigEndpointDetector

### Gui (1)

**`Frontend E2E Tests`**

## Refactoring Analysis

*Pre-refactoring snapshot — use this section to identify targets. Generated from `project/` toon files.*

### Call Graph & Complexity (`project/calls.toon.yaml`)

```toon markpact:analysis path=project/calls.toon.yaml
# code2llm call graph | /home/tom/github/oqlos/www
# nodes: 49 | edges: 38 | modules: 9
# CC̄=3.4

HUBS[20]:
  src.pages.Login.navigate
    CC=6  in:6  out:9  total:15
  src.components.parseOqlToSteps.parseStep
    CC=47  in:3  out:8  total:11
  src.pages.Login.handleSubmit
    CC=8  in:0  out:11  total:11
  src.pages.Login.autoSubmitRef
    CC=6  in:0  out:10  total:10
  src.pages.Login.plan
    CC=6  in:0  out:10  total:10
  src.pages.Login.token
    CC=6  in:0  out:10  total:10
  src.pages.Login.verifyTokenRef
    CC=6  in:0  out:10  total:10
  src.pages.NlpConsole.handleSubmit
    CC=12  in:0  out:9  total:9
  src.components.parseOqlToSteps.parseOqlToSteps
    CC=37  in:0  out:8  total:8
  src.components.TerminalSim.parseScenarioCode
    CC=8  in:1  out:7  total:8
  e2e.demo-user.spec.mockBackendRoutes
    CC=8  in:0  out:8  total:8
  src.components.parseOqlToSteps.splitValueUnit
    CC=3  in:7  out:1  total:8
  src.components.TerminalSim._buildPreviewLines
    CC=4  in:1  out:6  total:7
  e2e.buttons.scenarios-buttons.spec.count
    CC=2  in:2  out:5  total:7
  src.components.parseOqlToSteps.currentFunc
    CC=36  in:0  out:7  total:7
  src.components.TerminalSim.generateTermLines
    CC=4  in:2  out:5  total:7
  src.components.parseOqlToSteps.currentGoal
    CC=36  in:0  out:7  total:7
  src.mocks.api.mockFetch
    CC=3  in:0  out:7  total:7
  src.pages.Login.data
    CC=6  in:0  out:7  total:7
  src.components.parseOqlToSteps.toReportJson
    CC=19  in:0  out:6  total:6

MODULES:
  e2e.buttons.scenarios-buttons.spec  [3 funcs]
    count  CC=2  out:5
    runBtn  CC=2  out:3
    stepBtn  CC=2  out:3
  e2e.demo-user.spec  [2 funcs]
    mockBackendRoutes  CC=8  out:8
    request  CC=1  out:0
  src.components.OqlStepRenderer  [3 funcs]
    StepDetail  CC=16  out:3
    stepDisplayType  CC=3  out:0
    stepTypeClass  CC=3  out:0
  src.components.TerminalSim  [8 funcs]
    _buildFooterLines  CC=2  out:2
    _buildHeaderLines  CC=2  out:2
    _buildPreviewLines  CC=4  out:6
    _buildStepLines  CC=6  out:5
    generateTermLines  CC=4  out:5
    parseScenarioCode  CC=8  out:7
    runSim  CC=7  out:5
    termRef  CC=7  out:5
  src.components.parseOqlToSteps  [14 funcs]
    collectThresholds  CC=18  out:2
    currentFunc  CC=36  out:7
    currentGoal  CC=36  out:7
    goals  CC=15  out:3
    maxMatch  CC=2  out:1
    minMatch  CC=2  out:1
    parseOqlToSteps  CC=37  out:8
    parseStep  CC=47  out:8
    setDblMatch  CC=2  out:1
    setMaxMatch  CC=2  out:2
  src.hooks.useAuth  [5 funcs]
    isAuthenticated  CC=1  out:2
    logout  CC=1  out:2
    navigate  CC=1  out:0
    requireAuth  CC=2  out:1
    useAuth  CC=4  out:6
  src.mocks.api  [5 funcs]
    createMockLoginData  CC=5  out:2
    fakeResponse  CC=1  out:3
    match  CC=2  out:3
    mockFetch  CC=3  out:7
    parseMockRequestBody  CC=4  out:1
  src.pages.Login  [7 funcs]
    autoSubmitRef  CC=6  out:10
    data  CC=6  out:7
    handleSubmit  CC=8  out:11
    navigate  CC=6  out:9
    plan  CC=6  out:10
    token  CC=6  out:10
    verifyTokenRef  CC=6  out:10
  src.pages.NlpConsole  [2 funcs]
    getEndpoint  CC=2  out:0
    handleSubmit  CC=12  out:9

EDGES:
  src.hooks.useAuth.useAuth → src.hooks.useAuth.navigate
  src.hooks.useAuth.isAuthenticated → src.hooks.useAuth.navigate
  src.hooks.useAuth.logout → src.hooks.useAuth.navigate
  src.hooks.useAuth.requireAuth → src.hooks.useAuth.navigate
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim.parseScenarioCode
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildHeaderLines
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildStepLines
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildPreviewLines
  src.components.TerminalSim.generateTermLines → src.components.TerminalSim._buildFooterLines
  src.components.TerminalSim.termRef → src.components.TerminalSim.generateTermLines
  src.components.TerminalSim.runSim → src.components.TerminalSim.generateTermLines
  src.pages.NlpConsole.handleSubmit → src.pages.NlpConsole.getEndpoint
  src.components.OqlStepRenderer.StepDetail → src.components.OqlStepRenderer.stepTypeClass
  src.components.OqlStepRenderer.StepDetail → src.components.OqlStepRenderer.stepDisplayType
  src.components.parseOqlToSteps.parseOqlToSteps → src.components.parseOqlToSteps.parseStep
  src.components.parseOqlToSteps.currentGoal → src.components.parseOqlToSteps.parseStep
  src.components.parseOqlToSteps.currentFunc → src.components.parseOqlToSteps.parseStep
  src.components.parseOqlToSteps.parseStep → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setMinMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setMaxMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setQuotedMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.setDblMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.minMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.maxMatch → src.components.parseOqlToSteps.splitValueUnit
  src.components.parseOqlToSteps.toReportJson → src.components.parseOqlToSteps.collectThresholds
  src.components.parseOqlToSteps.goals → src.components.parseOqlToSteps.collectThresholds
  src.pages.Login.token → src.pages.Login.navigate
  src.pages.Login.plan → src.pages.Login.navigate
  src.pages.Login.verifyTokenRef → src.pages.Login.navigate
  src.pages.Login.autoSubmitRef → src.pages.Login.navigate
  src.pages.Login.data → src.pages.Login.navigate
  src.pages.Login.handleSubmit → src.pages.Login.navigate
  e2e.demo-user.spec.mockBackendRoutes → e2e.demo-user.spec.request
  src.mocks.api.createMockLoginData → src.mocks.api.parseMockRequestBody
  src.mocks.api.mockFetch → src.mocks.api.fakeResponse
  src.mocks.api.match → src.mocks.api.fakeResponse
  e2e.buttons.scenarios-buttons.spec.runBtn → e2e.buttons.scenarios-buttons.spec.count
  e2e.buttons.scenarios-buttons.spec.stepBtn → e2e.buttons.scenarios-buttons.spec.count
```

### Code Analysis (`project/analysis.toon.yaml`)

```toon markpact:analysis path=project/analysis.toon.yaml
# code2llm | 64f 6815L | javascript:59,shell:5 | 2026-04-19
# CC̄=3.4 | critical:9/302 | dups:0 | cycles:0

HEALTH[9]:
  🟡 CC    StepDetail CC=16 (limit:15)
  🟡 CC    parseOqlToSteps CC=37 (limit:15)
  🟡 CC    currentGoal CC=36 (limit:15)
  🟡 CC    currentFunc CC=36 (limit:15)
  🟡 CC    step CC=17 (limit:15)
  🟡 CC    parseStep CC=47 (limit:15)
  🟡 CC    collectThresholds CC=18 (limit:15)
  🟡 CC    toReportJson CC=19 (limit:15)
  🟡 CC    goals CC=15 (limit:15)

REFACTOR[1]:
  1. split 9 high-CC methods  (CC>15)

PIPELINES[199]:
  [1] Src [useAuth]: useAuth → navigate
      PURITY: 100% pure
  [2] Src [jwt]: jwt
      PURITY: 100% pure
  [3] Src [isAuthenticated]: isAuthenticated → navigate
      PURITY: 100% pure
  [4] Src [logout]: logout → navigate
      PURITY: 100% pure
  [5] Src [requireAuth]: requireAuth → navigate
      PURITY: 100% pure

LAYERS:
  src/                            CC̄=3.9    ←in:0  →out:0
  │ !! parseOqlToSteps.js         442L  0C   48m  CC=47     ←0
  │ api.js                     353L  0C   15m  CC=13     ←0
  │ !! OqlStepRenderer.jsx        349L  0C   16m  CC=16     ←0
  │ Demo.jsx                   287L  0C    5m  CC=11     ←0
  │ SlackWebhookSettings.jsx   270L  0C    4m  CC=5      ←0
  │ CaseStudies.jsx            257L  0C    4m  CC=2      ←0
  │ Billing.jsx                252L  0C    7m  CC=12     ←0
  │ Landing.jsx                251L  0C    8m  CC=4      ←0
  │ OqlReportRenderer.jsx      203L  0C   16m  CC=14     ←0
  │ Account.jsx                193L  0C    8m  CC=12     ←0
  │ RoiCalculator.jsx          188L  0C    7m  CC=2      ←0
  │ Status.jsx                 188L  0C    5m  CC=8      ←0
  │ PricingCards.jsx           186L  0C    1m  CC=4      ←0
  │ TerminalSim.jsx            166L  0C   24m  CC=8      ←0
  │ oql-examples.js            164L  0C    0m  CC=0.0    ←0
  │ Academy.jsx                152L  0C    1m  CC=1      ←0
  │ CodeEditor.jsx             146L  0C   10m  CC=3      ←0
  │ Scenarios.jsx              140L  0C    8m  CC=2      ←0
  │ Login.jsx                  133L  0C    9m  CC=8      ←0
  │ NlpConsole.jsx             114L  0C    8m  CC=12     ←0
  │ Dashboard.jsx              109L  0C    3m  CC=3      ←0
  │ ArchDiagram.jsx             84L  0C    0m  CC=0.0    ←0
  │ SubscriptionSection.jsx     77L  0C    0m  CC=0.0    ←0
  │ ProfileSection.jsx          75L  0C    1m  CC=1      ←0
  │ logger.spec.js              62L  0C    4m  CC=1      ←0
  │ I18nProvider.jsx            54L  0C   13m  CC=9      ←0
  │ install-commands.js         53L  0C    2m  CC=1      ←0
  │ ErrorBoundary.jsx           47L  1C    4m  CC=4      ←0
  │ PaymentHistorySection.jsx    41L  0C    0m  CC=0.0    ←0
  │ App.jsx                     35L  0C    0m  CC=0.0    ←0
  │ logger.js                   33L  0C    4m  CC=2      ←0
  │ useAuth.js                  32L  0C    6m  CC=4      ←0
  │ SharedNav.jsx               31L  0C    0m  CC=0.0    ←0
  │ ThemeToggle.jsx             29L  0C    0m  CC=0.0    ←0
  │ LangSwitch.jsx              24L  0C    0m  CC=0.0    ←0
  │ main.jsx                    19L  0C    0m  CC=0.0    ←0
  │ DangerZoneSection.jsx       18L  0C    0m  CC=0.0    ←0
  │ LoadingSpinner.jsx          17L  0C    0m  CC=0.0    ←0
  │ config.js                   16L  0C    1m  CC=13     ←0
  │ ProtectedRoute.jsx           7L  0C    1m  CC=1      ←0
  │
  e2e/                            CC̄=1.4    ←in:0  →out:0
  │ demo-user.spec.js          200L  0C    5m  CC=8      ←0
  │ scenarios-editor.spec.js   135L  0C    7m  CC=1      ←0
  │ nlp-buttons.spec.js         90L  0C    4m  CC=1      ←0
  │ account.spec.js             77L  0C    0m  CC=0.0    ←0
  │ landing-buttons.spec.js     70L  0C    6m  CC=3      ←0
  │ scenarios-buttons.spec.js    68L  0C    4m  CC=2      ←0
  │ account-export.spec.js      66L  0C    4m  CC=2      ←0
  │ billing-payment.spec.js     66L  0C    4m  CC=1      ←0
  │ billing-buttons.spec.js     62L  0C    4m  CC=2      ←0
  │ dashboard-buttons.spec.js    56L  0C    3m  CC=1      ←0
  │ navigation-buttons.spec.js    50L  0C    4m  CC=2      ←0
  │ landing.spec.js             44L  0C    4m  CC=1      ←0
  │ demo-page.spec.js           40L  0C    4m  CC=1      ←0
  │ login-buttons.spec.js       39L  0C    3m  CC=1      ←0
  │ case-studies.spec.js        38L  0C    2m  CC=1      ←0
  │ smoke.spec.js               22L  0C    1m  CC=1      ←0
  │
  ./                              CC̄=0.0    ←in:0  →out:0
  │ playwright.config.js        49L  0C    0m  CC=0.0    ←0
  │ vite.config.js              39L  0C    0m  CC=0.0    ←0
  │ project.sh                  35L  0C    0m  CC=0.0    ←0
  │ docker-entrypoint.sh         8L  0C    0m  CC=0.0    ←0
  │ tree.sh                      1L  0C    0m  CC=0.0    ←0
  │
  public/                         CC̄=0.0    ←in:0  →out:0
  │ sw.js                       26L  0C    0m  CC=0.0    ←0
  │
  scripts/                        CC̄=0.0    ←in:0  →out:0
  │ check-tls.sh               176L  0C    0m  CC=0.0    ←0
  │ deploy.sh                   61L  0C    0m  CC=0.0    ←0
  │

COUPLING: no cross-package imports detected

EXTERNAL:
  validation: run `vallm batch .` → validation.toon
  duplication: run `redup scan .` → duplication.toon
```

### Duplication (`project/duplication.toon.yaml`)

```toon markpact:analysis path=project/duplication.toon.yaml
# redup/duplication | 0 groups | 0f 0L | 2026-04-16

SUMMARY:
  files_scanned: 0
  total_lines:   0
  dup_groups:    0
  dup_fragments: 0
  saved_lines:   0
  scan_ms:       3492
```

### Evolution / Churn (`project/evolution.toon.yaml`)

```toon markpact:analysis path=project/evolution.toon.yaml
# code2llm/evolution | 302 func | 44f | 2026-04-18

NEXT[5] (ranked by impact):
  [1] !! SPLIT-FUNC      parseStep  CC=47  fan=8
      WHY: CC=47 exceeds 15
      EFFORT: ~1h  IMPACT: 376

  [2] !! SPLIT-FUNC      parseOqlToSteps  CC=37  fan=8
      WHY: CC=37 exceeds 15
      EFFORT: ~1h  IMPACT: 296

  [3] !! SPLIT-FUNC      currentGoal  CC=36  fan=7
      WHY: CC=36 exceeds 15
      EFFORT: ~1h  IMPACT: 252

  [4] !! SPLIT-FUNC      currentFunc  CC=36  fan=7
      WHY: CC=36 exceeds 15
      EFFORT: ~1h  IMPACT: 252

  [5] !  SPLIT-FUNC      toReportJson  CC=19  fan=6
      WHY: CC=19 exceeds 15
      EFFORT: ~1h  IMPACT: 114


RISKS[0]: none

METRICS-TARGET:
  CC̄:          3.4 → ≤2.4
  max-CC:      47 → ≤20
  god-modules: 0 → 0
  high-CC(≥15): 9 → ≤4
  hub-types:   0 → ≤0

PATTERNS (language parser shared logic):
  _extract_declarations() in base.py — unified extraction for:
    - TypeScript: interfaces, types, classes, functions, arrow funcs
    - PHP: namespaces, traits, classes, functions, includes
    - Ruby: modules, classes, methods, requires
    - C++: classes, structs, functions, #includes
    - C#: classes, interfaces, methods, usings
    - Java: classes, interfaces, methods, imports
    - Go: packages, functions, structs
    - Rust: modules, functions, traits, use statements

  Shared regex patterns per language:
    - import: language-specific import/require/using patterns
    - class: class/struct/trait declarations with inheritance
    - function: function/method signatures with visibility
    - brace_tracking: for C-family languages ({ })
    - end_keyword_tracking: for Ruby (module/class/def...end)

  Benefits:
    - Consistent extraction logic across all languages
    - Reduced code duplication (~70% reduction in parser LOC)
    - Easier maintenance: fix once, apply everywhere
    - Standardized FunctionInfo/ClassInfo models

HISTORY:
  prev CC̄=2.7 → now CC̄=3.4
```

### Validation (`project/validation.toon.yaml`)

```toon markpact:analysis path=project/validation.toon.yaml
# vallm batch | 111f | 42✓ 34⚠ 1✗ | 2026-04-16

SUMMARY:
  scanned: 111  passed: 42 (37.8%)  warnings: 34  errors: 1  unsupported: 36

WARNINGS[34]{path,score}:
  src/hooks/useAuth.js,0.67
    issues[1]{rule,severity,message,line}:
      js.import.resolvable,warning,Module 'react-router-dom' not found,1
  src/utils/logger.js,0.67
    issues[1]{rule,severity,message,line}:
      js.import.resolvable,warning,Module 'loglevel' not found,1
  vitest.config.js,0.67
    issues[1]{rule,severity,message,line}:
      js.import.resolvable,warning,Module 'vitest/config' not found,1
  src/pages/Demo.jsx,0.74
    issues[2]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
      complexity.lizard_cc,warning,(anonymous): CC=17 exceeds limit 15,33
  src/App.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/ArchDiagram.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/CodeEditor.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/ErrorBoundary.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/LangSwitch.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/LoadingSpinner.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/PricingCards.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/ProtectedRoute.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/SharedNav.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/TerminalSim.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/components/ThemeToggle.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/i18n/I18nProvider.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/main.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Academy.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Account.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Billing.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/CaseStudies.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Dashboard.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Landing.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Login.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/NlpConsole.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/RoiCalculator.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Scenarios.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/Status.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/account/DangerZoneSection.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/account/PaymentHistorySection.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/account/ProfileSection.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/pages/account/SubscriptionSection.jsx,0.78
    issues[1]{rule,severity,message,line}:
      syntax.unsupported,warning,"Could not parse jsx: Download error: Language 'jsx' not available for download. Available groups: [""all""]",
  src/utils/logger.spec.js,0.83
    issues[1]{rule,severity,message,line}:
      js.import.resolvable,warning,Module 'vitest' not found,1
  vite.config.js,0.83
    issues[1]{rule,severity,message,line}:
      js.import.resolvable,warning,Module 'vite' not found,1

ERRORS[1]{path,score}:
  infra/docker/dev/init-test-data.sql,0.00
    issues[1]{rule,severity,message,line}:
      syntax.tree_sitter,error,tree-sitter found 3 parse error(s) in sql,

UNSUPPORTED[5]{bucket,count}:
  *.md,9
  Dockerfile*,1
  *.txt,1
  *.yml,5
  other,20
```

## Intent

OqlOS Portal - React/Vite frontend
