<!-- code2docs:start --># www

![version](https://img.shields.io/badge/version-0.1.0-blue) ![python](https://img.shields.io/badge/python-%3E%3D3.9-blue) ![coverage](https://img.shields.io/badge/coverage-unknown-lightgrey) ![functions](https://img.shields.io/badge/functions-60-green)
> **60** functions | **0** classes | **20** files | CC̄ = 2.3

> Auto-generated project documentation from source code analysis.

**Author:** Tom Softreck <tom@sapletta.com>  
**License:** Not specified  
**Repository:** [https://github.com/oqlos/www](https://github.com/oqlos/www)

## Installation

### From PyPI

```bash
pip install www
```

### From Source

```bash
git clone https://github.com/oqlos/www
cd www
pip install -e .
```


## Quick Start

### CLI Usage

```bash
# Generate full documentation for your project
www ./my-project

# Only regenerate README
www ./my-project --readme-only

# Preview what would be generated (no file writes)
www ./my-project --dry-run

# Check documentation health
www check ./my-project

# Sync — regenerate only changed modules
www sync ./my-project
```

### Python API

```python
from www import generate_readme, generate_docs, Code2DocsConfig

# Quick: generate README
generate_readme("./my-project")

# Full: generate all documentation
config = Code2DocsConfig(project_name="mylib", verbose=True)
docs = generate_docs("./my-project", config=config)
```

## Generated Output

When you run `www`, the following files are produced:

```
<project>/
├── README.md                 # Main project README (auto-generated sections)
├── docs/
│   ├── api.md               # Consolidated API reference
│   ├── modules.md           # Module documentation with metrics
│   ├── architecture.md      # Architecture overview with diagrams
│   ├── dependency-graph.md  # Module dependency graphs
│   ├── coverage.md          # Docstring coverage report
│   ├── getting-started.md   # Getting started guide
│   ├── configuration.md    # Configuration reference
│   └── api-changelog.md    # API change tracking
├── examples/
│   ├── quickstart.py       # Basic usage examples
│   └── advanced_usage.py   # Advanced usage examples
├── CONTRIBUTING.md         # Contribution guidelines
└── mkdocs.yml             # MkDocs site configuration
```

## Configuration

Create `www.yaml` in your project root (or run `www init`):

```yaml
project:
  name: my-project
  source: ./
  output: ./docs/

readme:
  sections:
    - overview
    - install
    - quickstart
    - api
    - structure
  badges:
    - version
    - python
    - coverage
  sync_markers: true

docs:
  api_reference: true
  module_docs: true
  architecture: true
  changelog: true

examples:
  auto_generate: true
  from_entry_points: true

sync:
  strategy: markers    # markers | full | git-diff
  watch: false
  ignore:
    - "tests/"
    - "__pycache__"
```

## Sync Markers

www can update only specific sections of an existing README using HTML comment markers:

```markdown
<!-- www:start -->
# Project Title
... auto-generated content ...
<!-- www:end -->
```

Content outside the markers is preserved when regenerating. Enable this with `sync_markers: true` in your configuration.

## Architecture

```
www/
├── tree├── project    ├── config    ├── config    ├── main    ├── App        ├── oql-examples        ├── ArchDiagram        ├── CodeEditor        ├── PricingCards        ├── TerminalSim        ├── NlpConsole        ├── Login        ├── Landing        ├── Scenarios        ├── Billing        ├── Dashboard        ├── spec        ├── spec    ├── oqlos-landing```

## API Overview

### Functions

- `highlightOQL()` — —
- `html()` — —
- `highlightIQL()` — —
- `textareaRef()` — —
- `preRef()` — —
- `fn()` — —
- `handleScroll()` — —
- `termRef()` — —
- `runSim()` — —
- `idx()` — —
- `iv()` — —
- `navigate()` — —
- `user()` — —
- `jwt()` — —
- `handleSubmit()` — —
- `endpoint()` — —
- `res()` — —
- `data()` — —
- `navigate()` — —
- `token()` — —
- `verifyToken()` — —
- `res()` — —
- `data()` — —
- `handleSubmit()` — —
- `exampleKeys()` — —
- `navigate()` — —
- `user()` — —
- `jwt()` — —
- `exampleKeys()` — —
- `navigate()` — —
- `user()` — —
- `jwt()` — —
- `handleSubscribe()` — —
- `res()` — —
- `data()` — —
- `navigate()` — —
- `user()` — —
- `jwt()` — —
- `logout()` — —
- `heading()` — —
- `nav()` — —
- `errorMessages()` — —
- `response()` — —
- `response()` — —
- `status()` — —
- `highlightOQL()` — —
- `html()` — —
- `highlightIQL()` — —
- `TerminalSim()` — —
- `termRef()` — —
- `runSim()` — —
- `idx()` — —
- `iv()` — —
- `CodeEditor()` — —
- `textareaRef()` — —
- `preRef()` — —
- `fn()` — —
- `handleScroll()` — —
- `ArchDiagram()` — —
- `exampleKeys()` — —


## Project Structure

📄 `TODO.oqlos-landing` (16 functions)
📄 `e2e.landing.spec` (5 functions)
📄 `e2e.smoke.spec` (3 functions)
📄 `playwright.config`
📄 `project`
📄 `src.App`
📄 `src.components.ArchDiagram`
📄 `src.components.CodeEditor` (8 functions)
📄 `src.components.PricingCards`
📄 `src.components.TerminalSim` (4 functions)
📄 `src.components.oql-examples`
📄 `src.main`
📄 `src.pages.Billing` (6 functions)
📄 `src.pages.Dashboard` (4 functions)
📄 `src.pages.Landing` (1 functions)
📄 `src.pages.Login` (8 functions)
📄 `src.pages.NlpConsole` (7 functions)
📄 `src.pages.Scenarios` (4 functions)
📄 `tree`
📄 `vite.config`

## Requirements

- react ^18.3.1- react-dom ^18.3.1- react-router-dom ^6.26.0

## Contributing

**Contributors:**
- Tom Softreck <tom@sapletta.com>
- Tom Sapletta <tom-sapletta-com@users.noreply.github.com>

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/oqlos/www
cd www

# Install in development mode
pip install -e ".[dev]"

# Run tests
pytest
```

## Documentation

- 📖 [Full Documentation](https://github.com/oqlos/www/tree/main/docs) — API reference, module docs, architecture
- 🚀 [Getting Started](https://github.com/oqlos/www/blob/main/docs/getting-started.md) — Quick start guide
- 📚 [API Reference](https://github.com/oqlos/www/blob/main/docs/api.md) — Complete API documentation
- 🔧 [Configuration](https://github.com/oqlos/www/blob/main/docs/configuration.md) — Configuration options
- 💡 [Examples](./examples) — Usage examples and code samples

### Generated Files

| Output | Description | Link |
|--------|-------------|------|
| `README.md` | Project overview (this file) | — |
| `docs/api.md` | Consolidated API reference | [View](./docs/api.md) |
| `docs/modules.md` | Module reference with metrics | [View](./docs/modules.md) |
| `docs/architecture.md` | Architecture with diagrams | [View](./docs/architecture.md) |
| `docs/dependency-graph.md` | Dependency graphs | [View](./docs/dependency-graph.md) |
| `docs/coverage.md` | Docstring coverage report | [View](./docs/coverage.md) |
| `docs/getting-started.md` | Getting started guide | [View](./docs/getting-started.md) |
| `docs/configuration.md` | Configuration reference | [View](./docs/configuration.md) |
| `docs/api-changelog.md` | API change tracking | [View](./docs/api-changelog.md) |
| `CONTRIBUTING.md` | Contribution guidelines | [View](./CONTRIBUTING.md) |
| `examples/` | Usage examples | [Browse](./examples) |
| `mkdocs.yml` | MkDocs configuration | — |

<!-- code2docs:end -->