# llms-txt Specification

## Purpose
TBD - created by archiving change add-llms-txt-support. Update Purpose after archive.
## Requirements
### Requirement: Site publishes an llms.txt index file at the root

The Astro build SHALL emit a static `/llms.txt` file at the site root that conforms to the llmstxt.org format: a required H1 with the site name, an optional blockquote summary, and H2-delimited sections of markdown links to further resources. The file SHALL be reachable at `/llms.txt` both in `astro dev` and in the built static output.

#### Scenario: llms.txt exists in the build output

- **WHEN** `yarn build` completes
- **THEN** `dist/llms.txt` exists as a plain-text file
- **AND** the file begins with an H1 line (`# UHC Watch`)
- **AND** the file contains a blockquote summary on the second non-blank line
- **AND** the file contains at least one `## ` section listing markdown links

#### Scenario: llms.txt is served with text/plain content type

- **WHEN** a client requests `/llms.txt` from the static server
- **THEN** the response status is 200
- **AND** the `Content-Type` header is `text/plain; charset=utf-8`

### Requirement: llms.txt links each content page to its markdown companion

The `## Pages` section of `/llms.txt` SHALL contain one link per curated content page (`/`, `/about`, `/methods`, `/area-overview`, `/glossary`, `/abbreviations`), each pointing to that page's `.md` companion file. Link text and description SHALL come from `getSeoConfigForRoute()` so `llms.txt` stays in sync with each page's SEO metadata — including companion-only routes (`/area-overview` is registered in `seoRouteConfigs` even though it has no HTML page).

#### Scenario: Home, About, Methods, and Area overview appear under Pages

- **WHEN** `/llms.txt` is generated
- **THEN** the `## Pages` section contains `[UHC Watch: tracking affordable access to health care](/index.md)` with the default SEO description (home has no per-route override in `seoRouteConfigs`, so `getSeoConfigForRoute("/")` returns `defaultSeoConfig`)
- **AND** the `## Pages` section contains `[About the WHO Barcelona Office work & the UHC Watch network](/about.md)` with the about route's SEO description
- **AND** the `## Pages` section contains `[UHC Watch methods: how do we monitor progress towards UHC?](/methods.md)` with the methods route's SEO description
- **AND** the `## Pages` section contains `[UHC Watch - Area overview](/area-overview.md)` with the area-overview route's SEO description

### Requirement: Reference pages are linked to local Markdown companions

The `## Pages` section of `/llms.txt` SHALL link to the glossary and abbreviations Markdown companions. It SHALL NOT include the former external glossary or abbreviations resources.

#### Scenario: The index is generated

- **WHEN** `/llms.txt` is generated
- **THEN** it links to `/glossary.md` and `/abbreviations.md` using the deployment base path
- **AND** it does not contain the former external reference links

### Requirement: Each content page has a markdown companion at <path>.md

For every page listed in `llms.txt`, the build SHALL emit a markdown companion file at the page's path with a `.md` suffix (`/index.md`, `/about.md`, `/methods.md`). Each companion SHALL contain the page's prose content as markdown, excluding navigation, header, footer, and interactive widgets.

#### Scenario: Methods companion contains all method sections without shortText/text duplication

- **WHEN** `/methods.md` is generated from `getMethodsPageData()`
- **THEN** the file contains an H1 with the methods route's SEO title (`"UHC Watch methods: how do we monitor progress towards UHC?"`)
- **AND** for each method in `methods[]` the file contains an H2 with `method.sectionName`
- **AND** each H2 section contains `method.text` as raw markdown (which is a superset of `shortText` in the CMS)
- **AND** `method.shortText` is NOT emitted separately when `method.text` is non-empty
- **AND** when `method.text` is empty, `method.shortText` is used as fallback

#### Scenario: About companion contains office prose, team list, and experts list

- **WHEN** `/about.md` is generated from `getAboutPageData()`
- **THEN** the file contains an H1 with the page title
- **AND** the file contains the `officeInfo.officeText` markdown verbatim
- **AND** the file contains an H2 "Team" section listing each `team[]` member as `- Name - Role`
- **AND** the file contains an H2 "Experts" section listing each `experts[]` member as `- Name - Role, Country`
- **AND** bullets use ASCII hyphen-minus (`-`) as the name/role separator, not em-dash, to avoid mojibake under non-UTF-8 rendering clients

#### Scenario: Home companion contains a short site summary

- **WHEN** `/index.md` is generated
- **THEN** the file contains an H1 with the site name
- **AND** the file contains the hand-authored home summary (sourced from a committed markdown file, not the CMS) as body text

#### Scenario: Companions are served with text/markdown content type

- **WHEN** a client requests `/about.md` from the static server
- **THEN** the response status is 200
- **AND** the `Content-Type` header starts with `text/markdown`

### Requirement: Area overview companion lists every mapped country with status and summary

The build SHALL emit `/area-overview.md` derived from the home page's map markers (`buildMapMarkers(countries)`). The file SHALL list each country that has a summary and coordinates, sorted alphabetically by name, with its financial-protection status and one-line summary. This page exists only as a markdown companion — there is no corresponding HTML route.

#### Scenario: Area overview contains every marker as an H2 section

- **WHEN** `/area-overview.md` is generated and `markers.features` contains Spain and Albania
- **THEN** the file contains an H1 "UHC Watch - Area overview"
- **AND** the file contains `## Albania` appearing before `## Spain` (alphabetical order)
- **AND** each country section contains a `- Status: <label>` bullet with a human-readable status label
- **AND** each country section contains the country's `summary` as body text
- **AND** coordinates are NOT emitted (the overview is for LLMs, not for maps)

#### Scenario: Status enum is rendered with a human-readable label

- **WHEN** a country has `status === "VeryWeak"`
- **THEN** the generated bullet reads `- Status: Very weak` (not `- Status: VeryWeak`)

#### Scenario: Countries without a summary are omitted

- **WHEN** a feature's `properties.summary` is empty or whitespace
- **THEN** that country does NOT appear in the output (no `## {name}` section is emitted for it)

#### Scenario: Empty marker set is handled gracefully

- **WHEN** the feature list is empty
- **THEN** the file still contains the H1 and a short fallback notice ("No area data available.")

### Requirement: Companion files contain no HTML, scripts, or navigation chrome

Markdown companion files SHALL contain only markdown content derived from the page's editorial data. They SHALL NOT contain the site header, footer, navigation links, `<script>` tags, `<style>` tags, or raw HTML fragments beyond what the source markdown already includes.

#### Scenario: Companion file has no html tags outside embedded markdown

- **WHEN** any `/<page>.md` companion is generated
- **THEN** the output does NOT contain `<header`, `<footer`, `<nav`, `<script`, or `<link rel=`
- **AND** the output does NOT contain any `<!DOCTYPE` declaration

### Requirement: Companion files and llms.txt reuse existing data loaders

The endpoints emitting `/llms.txt` and `/<page>.md` SHALL reuse the same CMS data sources used by the corresponding pages. The area overview companion SHALL load countries directly and derive its markers with `buildMapMarkers`, without loading unrelated home content or images.

#### Scenario: Methods companion reflects a CMS content change

- **WHEN** a method's `shortText` is edited in the CMS
- **AND** `yarn build` is re-run
- **THEN** both `/methods` (HTML) and `/methods.md` (markdown companion) reflect the new text

### Requirement: llms.txt and companions are reversible additions

The change SHALL be reversible: deleting the new endpoint files, the serializer module, and the `/area-overview` entry in `seoRouteConfigs` SHALL fully restore prior behavior without data migration. The change MAY register a new route in `seoRouteConfigs` (a purely additive data-structure change that affects no existing page).

#### Scenario: Change touches only additive surfaces

- **WHEN** the feature is landed
- **THEN** no existing `.astro` page, layout, component, or React SPA rendering code is modified
- **AND** `seoRouteConfigs` gains a new entry for `/area-overview` but existing entries are unchanged


### Requirement: Reference pages have Markdown companions

The build SHALL generate `/glossary.md` and `/abbreviations.md` using the same reference data as the corresponding HTML pages, and list them under Pages in `llms.txt` with deployment-aware links. Glossary terms SHALL be sorted alphabetically with their definitions. Abbreviations SHALL be grouped in category order and sorted alphabetically within each category.

#### Scenario: Reference data is available

- **WHEN** a reference Markdown companion is generated
- **THEN** it contains a title and the same entries and definitions or meanings as its HTML page
- **AND** `llms.txt` links to the companion using the configured base path
