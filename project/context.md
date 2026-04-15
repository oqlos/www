# System Architecture Analysis

## Overview

- **Project**: /home/tom/github/oqlos/www
- **Primary Language**: javascript
- **Languages**: javascript: 18, shell: 2
- **Analysis Mode**: static
- **Total Functions**: 62
- **Total Classes**: 0
- **Modules**: 20
- **Entry Points**: 55

## Architecture by Module

### TODO.oqlos-landing
- **Functions**: 16
- **File**: `oqlos-landing.jsx`

### src.components.CodeEditor
- **Functions**: 8
- **File**: `CodeEditor.jsx`

### src.pages.Login
- **Functions**: 8
- **File**: `Login.jsx`

### src.pages.NlpConsole
- **Functions**: 7
- **File**: `NlpConsole.jsx`

### src.pages.Billing
- **Functions**: 6
- **File**: `Billing.jsx`

### e2e.landing.spec
- **Functions**: 5
- **File**: `landing.spec.js`

### src.pages.Landing
- **Functions**: 5
- **File**: `Landing.jsx`

### src.components.TerminalSim
- **Functions**: 4
- **File**: `TerminalSim.jsx`

### src.pages.Dashboard
- **Functions**: 4
- **File**: `Dashboard.jsx`

### src.pages.Scenarios
- **Functions**: 4
- **File**: `Scenarios.jsx`

### e2e.smoke.spec
- **Functions**: 3
- **File**: `smoke.spec.js`

## Key Entry Points

Main execution flows into the system:

### TODO.oqlos-landing.exampleKeys
- **Calls**: TODO.oqlos-landing.url, TODO.oqlos-landing.var, TODO.oqlos-landing.gradient, TODO.oqlos-landing.rgba, TODO.oqlos-landing.clamp, TODO.oqlos-landing.translateY, TODO.oqlos-landing.repeat, TODO.oqlos-landing.minmax

### src.pages.Login.token
- **Calls**: src.pages.Login.useCallback, src.pages.Login.setLoading, src.pages.Login.fetch, src.pages.Login.json, src.pages.Login.setItem, src.pages.Login.stringify, src.pages.Login.setMsg, src.pages.Login.setTimeout

### src.pages.Login.verifyToken
- **Calls**: src.pages.Login.useCallback, src.pages.Login.setLoading, src.pages.Login.fetch, src.pages.Login.json, src.pages.Login.setItem, src.pages.Login.stringify, src.pages.Login.setMsg, src.pages.Login.setTimeout

### TODO.oqlos-landing.TerminalSim
- **Calls**: TODO.oqlos-landing.useState, TODO.oqlos-landing.useRef, TODO.oqlos-landing.run, TODO.oqlos-landing.02s, TODO.oqlos-landing.setRunning, TODO.oqlos-landing.setLines, TODO.oqlos-landing.setInterval, TODO.oqlos-landing.clearInterval

### src.pages.NlpConsole.handleSubmit
- **Calls**: src.pages.NlpConsole.preventDefault, src.pages.NlpConsole.trim, src.pages.NlpConsole.setLoading, src.pages.NlpConsole.setOutput, src.pages.NlpConsole.fetch, src.pages.NlpConsole.stringify, src.pages.NlpConsole.json, src.pages.NlpConsole.join

### src.pages.Login.handleSubmit
- **Calls**: src.pages.Login.preventDefault, src.pages.Login.setLoading, src.pages.Login.setMsg, src.pages.Login.fetch, src.pages.Login.stringify, src.pages.Login.json, src.pages.Login.setEmail

### TODO.oqlos-landing.CodeEditor
- **Calls**: TODO.oqlos-landing.useState, TODO.oqlos-landing.useRef, TODO.oqlos-landing.useEffect, TODO.oqlos-landing.setCode, TODO.oqlos-landing.setHighlighted, TODO.oqlos-landing.fn, TODO.oqlos-landing.join

### src.components.CodeEditor.highlightOQL
- **Calls**: src.components.CodeEditor.split, src.components.CodeEditor.map, src.components.CodeEditor.replace, src.components.CodeEditor.b, src.components.CodeEditor.String, src.components.CodeEditor.padStart

### src.components.CodeEditor.highlightIQL
- **Calls**: src.components.CodeEditor.split, src.components.CodeEditor.map, src.components.CodeEditor.replace, src.components.CodeEditor.b, src.components.CodeEditor.String, src.components.CodeEditor.padStart

### TODO.oqlos-landing.highlightOQL
- **Calls**: TODO.oqlos-landing.split, TODO.oqlos-landing.map, TODO.oqlos-landing.replace, TODO.oqlos-landing.b, TODO.oqlos-landing.String, TODO.oqlos-landing.padStart

### TODO.oqlos-landing.highlightIQL
- **Calls**: TODO.oqlos-landing.split, TODO.oqlos-landing.map, TODO.oqlos-landing.replace, TODO.oqlos-landing.b, TODO.oqlos-landing.String, TODO.oqlos-landing.padStart

### src.components.TerminalSim.runSim
- **Calls**: src.components.TerminalSim.setRunning, src.components.TerminalSim.setLines, src.components.TerminalSim.setInterval, src.components.TerminalSim.clearInterval

### src.components.TerminalSim.idx
- **Calls**: src.components.TerminalSim.setInterval, src.components.TerminalSim.setLines, src.components.TerminalSim.clearInterval, src.components.TerminalSim.setRunning

### src.components.TerminalSim.iv
- **Calls**: src.components.TerminalSim.setInterval, src.components.TerminalSim.setLines, src.components.TerminalSim.clearInterval, src.components.TerminalSim.setRunning

### src.pages.Billing.handleSubscribe
- **Calls**: src.pages.Billing.navigate, src.pages.Billing.fetch, src.pages.Billing.json, src.pages.Billing.alert

### src.pages.Landing.extractTextFromJSX
- **Calls**: src.pages.Landing.String, src.pages.Landing.isArray, src.pages.Landing.map, src.pages.Landing.join

### TODO.oqlos-landing.runSim
- **Calls**: TODO.oqlos-landing.setRunning, TODO.oqlos-landing.setLines, TODO.oqlos-landing.setInterval, TODO.oqlos-landing.clearInterval

### TODO.oqlos-landing.idx
- **Calls**: TODO.oqlos-landing.setInterval, TODO.oqlos-landing.setLines, TODO.oqlos-landing.clearInterval, TODO.oqlos-landing.setRunning

### TODO.oqlos-landing.iv
- **Calls**: TODO.oqlos-landing.setInterval, TODO.oqlos-landing.setLines, TODO.oqlos-landing.clearInterval, TODO.oqlos-landing.setRunning

### TODO.oqlos-landing.ArchDiagram
- **Calls**: TODO.oqlos-landing.url, TODO.oqlos-landing.rgba, TODO.oqlos-landing.CLI, TODO.oqlos-landing.oqlagent

### src.pages.NlpConsole.data
- **Calls**: src.pages.NlpConsole.setOutput, src.pages.NlpConsole.join, src.pages.NlpConsole.stringify

### e2e.smoke.spec.response
- **Calls**: e2e.smoke.spec.status, e2e.smoke.spec.expect, e2e.smoke.spec.toContain

### src.components.CodeEditor.textareaRef
- **Calls**: src.components.CodeEditor.useEffect, src.components.CodeEditor.setCode

### src.components.CodeEditor.preRef
- **Calls**: src.components.CodeEditor.useEffect, src.components.CodeEditor.setCode

### src.pages.NlpConsole.user
- **Calls**: src.pages.NlpConsole.parse, src.pages.NlpConsole.getItem

### src.pages.NlpConsole.endpoint
- **Calls**: src.pages.NlpConsole.fetch, src.pages.NlpConsole.stringify

### src.pages.NlpConsole.res
- **Calls**: src.pages.NlpConsole.fetch, src.pages.NlpConsole.stringify

### src.pages.Billing.user
- **Calls**: src.pages.Billing.parse, src.pages.Billing.getItem

### src.pages.Billing.jwt
- **Calls**: src.pages.Billing.useEffect, src.pages.Billing.setPlan

### src.pages.Login.res
- **Calls**: src.pages.Login.fetch, src.pages.Login.stringify

## Process Flows

Key execution flows identified:

### Flow 1: exampleKeys
```
exampleKeys [TODO.oqlos-landing]
```

### Flow 2: token
```
token [src.pages.Login]
```

### Flow 3: verifyToken
```
verifyToken [src.pages.Login]
```

### Flow 4: TerminalSim
```
TerminalSim [TODO.oqlos-landing]
```

### Flow 5: handleSubmit
```
handleSubmit [src.pages.NlpConsole]
```

### Flow 6: CodeEditor
```
CodeEditor [TODO.oqlos-landing]
```

### Flow 7: highlightOQL
```
highlightOQL [src.components.CodeEditor]
```

### Flow 8: highlightIQL
```
highlightIQL [src.components.CodeEditor]
```

### Flow 9: runSim
```
runSim [src.components.TerminalSim]
```

### Flow 10: idx
```
idx [src.components.TerminalSim]
```

## Data Transformation Functions

Key functions that process and transform data:

## Public API Surface

Functions exposed as public API (no underscore prefix):

- `TODO.oqlos-landing.exampleKeys` - 10 calls
- `src.pages.Login.token` - 9 calls
- `src.pages.Login.verifyToken` - 9 calls
- `TODO.oqlos-landing.TerminalSim` - 9 calls
- `src.pages.NlpConsole.handleSubmit` - 8 calls
- `src.pages.Login.navigate` - 8 calls
- `src.pages.Login.handleSubmit` - 7 calls
- `TODO.oqlos-landing.CodeEditor` - 7 calls
- `src.components.CodeEditor.highlightOQL` - 6 calls
- `src.components.CodeEditor.highlightIQL` - 6 calls
- `TODO.oqlos-landing.highlightOQL` - 6 calls
- `TODO.oqlos-landing.highlightIQL` - 6 calls
- `src.components.TerminalSim.runSim` - 4 calls
- `src.components.TerminalSim.idx` - 4 calls
- `src.components.TerminalSim.iv` - 4 calls
- `src.pages.Billing.handleSubscribe` - 4 calls
- `src.pages.Landing.extractTextFromJSX` - 4 calls
- `TODO.oqlos-landing.runSim` - 4 calls
- `TODO.oqlos-landing.idx` - 4 calls
- `TODO.oqlos-landing.iv` - 4 calls
- `TODO.oqlos-landing.ArchDiagram` - 4 calls
- `src.pages.NlpConsole.data` - 3 calls
- `e2e.smoke.spec.response` - 3 calls
- `src.components.CodeEditor.textareaRef` - 2 calls
- `src.components.CodeEditor.preRef` - 2 calls
- `src.pages.NlpConsole.navigate` - 2 calls
- `src.pages.NlpConsole.user` - 2 calls
- `src.pages.NlpConsole.endpoint` - 2 calls
- `src.pages.NlpConsole.res` - 2 calls
- `src.pages.Billing.navigate` - 2 calls
- `src.pages.Billing.user` - 2 calls
- `src.pages.Billing.jwt` - 2 calls
- `src.pages.Login.res` - 2 calls
- `src.pages.Login.data` - 2 calls
- `src.pages.Dashboard.navigate` - 2 calls
- `src.pages.Dashboard.user` - 2 calls
- `src.pages.Dashboard.logout` - 2 calls
- `src.pages.Scenarios.navigate` - 2 calls
- `src.pages.Scenarios.user` - 2 calls
- `TODO.oqlos-landing.textareaRef` - 2 calls

## System Interactions

How components interact:

```mermaid
graph TD
    exampleKeys --> url
    exampleKeys --> var
    exampleKeys --> gradient
    exampleKeys --> rgba
    exampleKeys --> clamp
    token --> useCallback
    token --> setLoading
    token --> fetch
    token --> json
    token --> setItem
    verifyToken --> useCallback
    verifyToken --> setLoading
    verifyToken --> fetch
    verifyToken --> json
    verifyToken --> setItem
    TerminalSim --> useState
    TerminalSim --> useRef
    TerminalSim --> run
    TerminalSim --> 02s
    TerminalSim --> setRunning
    handleSubmit --> preventDefault
    handleSubmit --> trim
    handleSubmit --> setLoading
    handleSubmit --> setOutput
    handleSubmit --> fetch
    handleSubmit --> setMsg
    handleSubmit --> stringify
    CodeEditor --> useState
    CodeEditor --> useRef
    CodeEditor --> useEffect
```

## Reverse Engineering Guidelines

1. **Entry Points**: Start analysis from the entry points listed above
2. **Core Logic**: Focus on classes with many methods
3. **Data Flow**: Follow data transformation functions
4. **Process Flows**: Use the flow diagrams for execution paths
5. **API Surface**: Public API functions reveal the interface

## Context for LLM

Maintain the identified architectural patterns and public API surface when suggesting changes.