# OqlOS Portal — Web Interface

OqlOS Portal — React-based web interface for OqlOS runtime

## Metadata

- **name**: `oqlos-portal`
- **version**: `0.1.1`
- **type**: `react`
- **license**: Apache-2.0
- **ai_model**: `openrouter/qwen/qwen3-coder-next`
- **ecosystem**: SUMD + DOQL + testql + taskfile
- **generated_from**: package.json, Taskfile.yml, app.doql.less, app.doql.css, goal.yaml, .env.example, src(46 files)

## Intent

React-based web interface for OqlOS runtime with Vite build system

## Architecture

```
SUMD (description) → DOQL/source (code) → taskfile (automation) → testql (verification)
```

### DOQL Application Declaration (`app.doql.less`, `app.doql.css`)

```less
app {
  name: oqlos-portal;
  version: 0.1.1;
}
```

### DOQL Interfaces

- `interface[type="web"]` — framework: vite, react

### Source Structure

- `src/` — React application source (46 files)
- `public/` — Static assets
- `e2e/` — Playwright E2E tests

## Workflows

### DOQL Workflows (`app.doql.less`, `app.doql.css`)

- **install** `[manual]`: `npm install`
- **dev** `[manual]`: `vite --port 3000`
- **build** `[manual]`: `vite build`
- **preview** `[manual]`: `vite preview`
- **test:unit** `[manual]`: `vitest run`
- **test:e2e** `[manual]`: `playwright test`
- **lint** `[manual]`: `eslint .`

### Taskfile Tasks (`Taskfile.yml`)

```yaml
# JavaScript/Node.js project using npm scripts
```

## Configuration

```yaml
project:
  name: oqlos-portal
  version: 0.1.1
  type: react
```

## Dependencies

### Runtime

- `react^18.3.1`
- `react-dom^18.3.1`
- `loglevel^1.9.2`
- `mitt^3.0.1`

### Development

- `vite`
- `vitest`
- `playwright`
- `eslint`

## Deployment

```bash
npm install
npm run build
npm run preview
```

Docker support via `Dockerfile` and `docker-compose`.
