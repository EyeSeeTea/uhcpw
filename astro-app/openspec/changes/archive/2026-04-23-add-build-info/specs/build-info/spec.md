## ADDED Requirements

### Requirement: Build info resolver
The project SHALL provide a single helper that resolves build metadata at build time, returning an object with `version` (from `package.json`), `commit` (short git SHA, 7 chars), and `buildDate` (ISO-8601 UTC timestamp).

#### Scenario: All sources available
- **WHEN** the helper runs in an environment with git and a readable `package.json`
- **THEN** it returns `{ version: "<package.json version>", commit: "<short sha>", buildDate: "<ISO timestamp>" }`

#### Scenario: Git unavailable
- **WHEN** `git rev-parse --short HEAD` fails (no git binary, missing `.git`, or error)
- **THEN** the helper returns `commit: "unknown"` and does not throw

#### Scenario: package.json unreadable
- **WHEN** `package.json` cannot be read or parsed
- **THEN** the helper returns `version: "0.0.0"` and does not throw

### Requirement: Build info injected at build time
Build info SHALL be injected into the client bundle via Vite `define` (or equivalent) as a single `__BUILD_INFO__` global, so consuming modules receive literal values with no runtime computation.

#### Scenario: Value inlined in output
- **WHEN** the site is built
- **THEN** references to `__BUILD_INFO__` in source are replaced with the resolved object literal in the output bundle

### Requirement: Meta tag on every page
Every HTML page SHALL include a single `<meta name="build-info" content="v{version} / {commit} / {buildDate}">` tag in `<head>`, rendered by the base layout.

#### Scenario: Meta tag present in rendered page
- **WHEN** any page using the base layout is requested
- **THEN** its HTML `<head>` contains `<meta name="build-info" content="v... / ... / ...">` with the resolved values

### Requirement: Version JSON endpoint
The site SHALL expose a static `/version.json` endpoint returning the build info as structured JSON with `Content-Type: application/json`.

#### Scenario: Endpoint returns structured JSON
- **WHEN** `/version.json` is requested
- **THEN** the response body is `{ "version": "<version>", "commit": "<commit>", "buildDate": "<iso>" }` with `Content-Type: application/json`

#### Scenario: Endpoint is statically generated
- **WHEN** the site is built
- **THEN** `dist/version.json` exists as a static file (no server required)
