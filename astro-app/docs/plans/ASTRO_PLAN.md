# Astro SSG Migration Plan for UHCPW - INCREMENTAL APPROACH

## Executive Summary

This document outlines an **incremental migration plan** to convert the Universal Health Coverage Platform for WHO European Region (UHCPW) from a React SPA to **Astro SSG (Static Site Generation)** with React islands for interactivity.

**Key Decisions:**

-   ✅ **Fully SSG** - No hybrid/SSR mode
-   ✅ **Static builds** with data fetched at build time from DHIS2
-   ✅ **React islands** with selective hydration for interactive components
-   ✅ **Incremental migration** - Run both apps in parallel initially
-   ✅ **Auth handled by DHIS2** - Only dev proxy with credentials needed

**Total Estimated Time: 180-220 hours (5-6 weeks for a senior developer)**

---

## Table of Contents

1. [Migration Strategy](#1-migration-strategy)
2. [Key Concerns & Solutions](#2-key-concerns--solutions)
3. [Incremental Migration Phases](#3-incremental-migration-phases)
4. [Technical Implementation Details](#4-technical-implementation-details)
5. [Testing Strategy](#5-testing-strategy)
6. [Risk Mitigation](#6-risk-mitigation)

---

## 1. Migration Strategy

### 1.1 Incremental Approach Overview

Instead of a complete rewrite, we'll migrate the project incrementally:

**Phase 0:** Proof of Concept (1 week)

-   Set up Astro alongside existing React app
-   Migrate one simple page (About)
-   Validate all tooling works
-   **Can deploy React app while working on Astro**

**Phase 1-3:** Core Infrastructure (2 weeks)

-   Parallel development: React app still works
-   Build new infrastructure in Astro
-   Migrate static components incrementally

**Phase 4-6:** Page Migration (2-3 weeks)

-   Migrate pages one by one
-   Test each page independently
-   Can deploy either version

**Phase 7:** Cutover (1 week)

-   Switch routing to Astro
-   Remove React build
-   Final testing and deployment

### 1.2 Architecture: Astro SSG + React Islands

```
Build Time:
  DHIS2 API → Data Fetching → Static HTML + JSON

Runtime:
  Static HTML (instant) → React Islands (hydrate on interaction)
```

**Static Generation:**

-   All pages pre-rendered at build time
-   Data fetched from DHIS2 during build
-   Generates static HTML + JSON for hydration

**React Islands:**

-   Interactive components load React only when needed
-   Client directives: `client:load`, `client:visible`, `client:idle`, `client:only`
-   Shared state via Nano Stores

**Example:**

```astro
---
// Static page shell
const countries = await fetchCountries();
---
<Layout>
  <h1>Countries</h1>
  <!-- Static content -->
  <CountryList countries={countries} />

  <!-- Interactive island -->
  <CountryFilter client:load countries={countries} />
</Layout>
```

### 1.3 Project Structure: Side-by-Side

During migration, both apps coexist:

```
uhcpw/
├── src/                    # Current React app (unchanged)
│   ├── domain/            # ✅ Shared with Astro
│   ├── data/              # ✅ Shared with Astro
│   ├── webapp/            # 🔄 Gradually migrate to astro-app/
│   ├── index.tsx          # React entry
│   └── ...
├── astro-app/             # New Astro app
│   ├── public/
│   ├── src/
│   │   ├── pages/         # .astro files
│   │   ├── components/    # New components
│   │   ├── layouts/
│   │   ├── lib/           # Utilities
│   │   └── islands/       # React components for islands
│   ├── astro.config.mjs
│   └── tsconfig.json
├── package.json           # Updated with Astro deps
└── ...
```

**Benefits:**

-   ✅ No downtime - React app continues working
-   ✅ Gradual migration - test each part
-   ✅ Shared code - domain/data layers reused
-   ✅ Easy rollback - just switch build command

---

## 2. Key Concerns & Solutions

### 2.1 Browser Objects in React Components

**Problem:** Components reference `window`, `document`, `localStorage` during SSR.

**Components with Browser References Found:**

-   `SeoMetaTags.tsx` - `window.location`
-   `ScrollToTopButton.tsx` - `window.scrollY`, `document.getElementById`
-   `Map.tsx` - `document.createElement`
-   `MobileSlider.tsx` - `document.getElementById`

**Solutions:**

#### Solution 1: Client-Only Directive

```astro
<!-- Component only renders on client -->
<ScrollToTopButton client:only="react" />
```

#### Solution 2: Guard Browser Access

```tsx
// Before
const baseUrl = window.location.origin;

// After
const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://default.com";
```

#### Solution 3: useEffect for Browser APIs

```tsx
function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only runs on client
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return visible ? <Button /> : null;
}
```

#### Solution 4: Extract Browser Logic

```tsx
// src/islands/ScrollHandler.tsx
import { useEffect } from "react";

export function useScrollPosition() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return scrollY;
}
```

**Implementation Plan:**

1. Audit all components for browser APIs (✅ Done above)
2. Category: Client-only vs Adaptable
3. Add guards or use `client:only` directive
4. Create utility hooks for common patterns

**Time Estimate: 8-10 hours**

---

### 2.2 Styled Components → Astro

**Current Usage:**

-   ~50+ components use styled-components
-   Theme context via Material-UI ThemeProvider

**Migration Options:**

#### Option A: Keep Styled Components (Recommended for incremental)

**Pros:** No component changes needed
**Cons:** Larger bundle, requires React

```astro
---
// Works in islands
import StyledComponent from './islands/StyledComponent';
---
<StyledComponent client:load />
```

#### Option B: Migrate to Astro Scoped Styles (Gradual)

**Pros:** Better performance, no runtime CSS
**Cons:** Manual migration

```astro
---
// Component.astro
---
<div class="container">
  <h1 class="title">Hello</h1>
</div>

<style>
  .container {
    padding: 20px;
  }
  .title {
    color: blue;
  }
</style>
```

#### Option C: Hybrid Approach (Best for Incremental Migration)

1. **New components** → Astro scoped styles
2. **Static components** → Migrate to Astro styles
3. **Interactive islands** → Keep styled-components
4. **Shared styles** → CSS custom properties

**Implementation Strategy:**

```typescript
// 1. Extract theme to CSS custom properties
// astro-app/src/styles/theme.css
:root {
  --color-primary: #3f51b5;
  --color-accent: #f50057;
  --spacing-unit: 8px;
}

// 2. Create theme context for islands
// astro-app/src/islands/ThemeProvider.tsx
import { ThemeProvider } from '@material-ui/core/styles';
import { muiTheme } from '@/themes/dhis2.theme';

export function MaterialUIWrapper({ children }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

// 3. Use in island
<MaterialUIWrapper>
  <PolicyExplorerTable client:load data={data} />
</MaterialUIWrapper>
```

**Migration Checklist:**

-   [ ] Audit components: Static vs Interactive (2h)
-   [ ] Extract theme to CSS variables (3h)
-   [ ] Create theme wrapper for islands (2h)
-   [ ] Migrate 10 static components to Astro styles (10h)
-   [ ] Keep styled-components for complex islands (0h)

**Time Estimate: 17-20 hours**

---

### 2.3 CompositionRoot in Astro SSG

**Current Pattern:**

```typescript
// src/CompositionRoot.ts
export function getCompositionRoot(api, dataEngine, instance) {
  const repositories = initializeRepositories(api, dataEngine, instance);
  return {
    users: { getCurrent: new GetCurrentUserUseCase(...) },
    countries: { get: new GetCountriesUseCase(...) },
    // ...
  };
}
```

**Challenge:** No runtime API, need build-time data fetching.

**Solution: Build-Time Composition Root**

```typescript
// astro-app/src/lib/composition-root.server.ts
import { D2Api } from '@/types/d2-api';
import { getD2APiFromInstance } from '@/utils/d2-api';
import { Instance } from '@/data/entities/Instance';

// Build-time API instance
let serverApi: D2Api | null = null;

export function getServerApi(): D2Api {
  if (!serverApi) {
    const instance = new Instance({
      url: import.meta.env.DHIS2_BASE_URL || process.env.DHIS2_BASE_URL
    });
    serverApi = getD2APiFromInstance(instance);
  }
  return serverApi;
}

export function getServerCompositionRoot() {
  const api = getServerApi();
  // Reuse existing repositories from src/data
  return getCompositionRoot(api, null, null);
}

// Usage in .astro files
---
import { getServerCompositionRoot } from '@/lib/composition-root.server';

const compositionRoot = getServerCompositionRoot();
const countries = await compositionRoot.countries.get.execute().runAsync();
---
```

**For Client-Side Islands:**

```typescript
// astro-app/src/lib/composition-root.client.ts
import { atom } from "nanostores";

// Store for client-side composition root
export const $compositionRoot = atom(null);

// Initialize in layout with data from build
export function initClientCompositionRoot(initialData) {
    // Use API endpoints for client-side data fetching
    const api = createClientApi("/api");
    const root = getCompositionRoot(api, null, null);
    $compositionRoot.set(root);
}
```

**API Endpoints for Dynamic Data:**

```typescript
// astro-app/src/pages/api/countries.ts
import type { APIRoute } from "astro";
import { getServerCompositionRoot } from "@/lib/composition-root.server";

export const GET: APIRoute = async () => {
    const root = getServerCompositionRoot();
    const countries = await root.countries.get.execute().runAsync();

    return new Response(JSON.stringify(countries.data), {
        headers: { "Content-Type": "application/json" },
    });
};
```

**Summary:**

-   ✅ **Build time:** Use server composition root with DHIS2 API
-   ✅ **Client time:** Use API endpoints or preloaded data
-   ✅ **Shared:** Reuse domain/data layers from existing code
-   ✅ **Clean Architecture:** Maintained throughout

**Time Estimate: 10-12 hours**

---

### 2.4 Project Setup Changes

#### 2.4.1 TypeScript Configuration

**Current:** `tsconfig.json` for React
**New:** Astro-specific config

```jsonc
// astro-app/tsconfig.json
{
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "react-jsx",
        "jsxImportSource": "react",

        // Paths
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"],
            "@/domain/*": ["../src/domain/*"],
            "@/data/*": ["../src/data/*"],
            "@/types/*": ["../src/types/*"],
            "@/utils/*": ["../src/utils/*"]
        },

        // Type checking
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitAny": true,
        "strictNullChecks": true,

        // Allow importing .astro files
        "types": ["astro/client"]
    },
    "include": ["src/**/*", "../src/domain/**/*", "../src/data/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

**Key Changes:**

-   Extends Astro's base config
-   Maps paths to shared code (`src/domain`, `src/data`)
-   Includes Astro client types
-   Keeps React JSX support

**Time: 2 hours**

#### 2.4.2 Testing Configuration

**Challenge:** Jest + Astro components

**Solution: Vitest for Astro, Keep Jest for Shared Code**

```typescript
// astro-app/vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
    },
    resolve: {
        alias: {
            "@": "/src",
            "@/domain": "../src/domain",
            "@/data": "../src/data",
        },
    },
});
```

```typescript
// astro-app/src/test/setup.ts
import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => cleanup());
```

**Testing Strategy:**

-   **Domain/Data layers:** Keep Jest tests (no changes)
-   **React islands:** Vitest + React Testing Library
-   **Astro components:** Vitest with astro fixtures
-   **E2E:** Keep Cypress (update URLs)

```json
// package.json scripts
{
    "test": "npm run test:jest && npm run test:vitest",
    "test:jest": "jest --config jest.config.js",
    "test:vitest": "vitest run --config astro-app/vitest.config.ts",
    "test:watch": "vitest --config astro-app/vitest.config.ts"
}
```

**Time: 6-8 hours**

#### 2.4.3 Build Configuration

```javascript
// astro-app/astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://apps.who.int", // Your production URL
    base: "/dhis2/uhcwatch", // Base path if needed

    output: "static", // Full SSG

    integrations: [
        react(), // React islands support
        sitemap(), // Auto-generate sitemap
    ],

    vite: {
        resolve: {
            alias: {
                "@": "/src",
                "@/domain": "/src/domain",
                "@/data": "/src/data",
            },
        },
        // Dev server proxy for DHIS2
        server: {
            proxy: {
                "/dhis2-api": {
                    target: process.env.DHIS2_BASE_URL || "http://localhost:8080",
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/dhis2-api/, ""),
                    configure: (proxy, options) => {
                        // Add basic auth for dev
                        const auth = process.env.DHIS2_AUTH; // "username:password"
                        if (auth) {
                            proxy.on("proxyReq", proxyReq => {
                                const encoded = Buffer.from(auth).toString("base64");
                                proxyReq.setHeader("Authorization", `Basic ${encoded}`);
                            });
                        }
                    },
                },
            },
        },
    },

    // Build optimization
    build: {
        inlineStylesheets: "auto",
    },

    // Image optimization
    image: {
        service: {
            entrypoint: "astro/assets/services/sharp",
        },
    },
});
```

**Environment Variables:**

```bash
# .env.development
DHIS2_BASE_URL=http://localhost:8080
DHIS2_AUTH=admin:district
PUBLIC_BASE_URL=http://localhost:4321

# .env.production
DHIS2_BASE_URL=https://your-dhis2-instance.com
DHIS2_AUTH=build:credentials
PUBLIC_BASE_URL=https://apps.who.int/dhis2/uhcwatch
```

**Time: 4-5 hours**

---

### 2.5 i18n with @dhis2/d2-i18n in Astro

**Current Setup:**

-   Uses `@dhis2/d2-i18n` (i18next wrapper)
-   Auto-generated translations in `src/locales/`
-   POT/PO files in `i18n/`

**Challenge:** DHIS2 i18n library designed for runtime, needs build-time adaptation.

**Solution: Astro i18n Integration + DHIS2 Compatibility Layer**

#### Step 1: Install Astro i18n

```bash
npm install astro-i18next i18next
```

#### Step 2: Create Compatibility Layer

```typescript
// astro-app/src/lib/i18n.ts
import i18next from "i18next";

// Import existing translations
import enTranslations from "@/locales/en/translations.json";
import esTranslations from "@/locales/es/translations.json";

const defaultLocale = "en";
const locales = ["en", "es"];

// Initialize i18next for Astro
i18next.init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    resources: {
        en: { translation: enTranslations },
        es: { translation: esTranslations },
    },
});

// DHIS2-compatible API
export const i18n = {
    t: (key: string, options?: any) => i18next.t(key, options),
    changeLanguage: (lng: string) => i18next.changeLanguage(lng),
    language: () => i18next.language,
};

export function t(key: string, options?: any) {
    return i18n.t(key, options);
}

export { defaultLocale, locales };
```

#### Step 3: Astro i18n Configuration

```javascript
// astro-app/astro-i18next.config.mjs
export default {
    defaultLocale: "en",
    locales: ["en", "es"],
    routes: {
        es: {
            about: "acerca-de",
            resources: "recursos",
            methods: "metodos",
        },
    },
    showDefaultLocale: false, // /en/about vs /about
};
```

#### Step 4: Use in Astro Components

```astro
---
// astro-app/src/pages/about.astro
import { t } from '@/lib/i18n';
import Layout from '@/layouts/Layout.astro';

const title = t('About Us');
const description = t('Learn more about our platform');
---
<Layout title={title}>
  <h1>{title}</h1>
  <p>{description}</p>
</Layout>
```

#### Step 5: Use in React Islands

```tsx
// astro-app/src/islands/PolicyExplorer.tsx
import { useEffect, useState } from "react";
import { i18n } from "@/lib/i18n";

export function PolicyExplorer() {
    const [t, setT] = useState(() => i18n.t);

    // Re-render on language change
    useEffect(() => {
        const handleLanguageChange = () => {
            setT(() => i18n.t);
        };
        // Listen for language changes
        window.addEventListener("languagechange", handleLanguageChange);
        return () => window.removeEventListener("languagechange", handleLanguageChange);
    }, []);

    return (
        <div>
            <h2>{t("Policy Explorer")}</h2>
        </div>
    );
}
```

#### Step 6: Language Switcher

```typescript
// astro-app/src/islands/LanguageSwitcher.tsx
import { i18n } from "@/lib/i18n";

export function LanguageSwitcher() {
    const handleChange = (lang: string) => {
        i18n.changeLanguage(lang);
        // Emit event for islands
        window.dispatchEvent(new Event("languagechange"));
        // Reload page to update static content (if needed)
        // window.location.href = `/${lang}${window.location.pathname}`;
    };

    return (
        <select onChange={e => handleChange(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
        </select>
    );
}
```

#### Step 7: Build-Time Translation Loading

```typescript
// astro-app/src/lib/load-translations.ts
import fs from "fs";
import path from "path";

export function loadTranslations(locale: string) {
    const filePath = path.join(process.cwd(), "../src/locales", locale, "translations.json");
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Use in getStaticPaths
export async function getStaticPaths() {
    const locales = ["en", "es"];
    return locales.map(locale => ({
        params: { lang: locale },
        props: { translations: loadTranslations(locale) },
    }));
}
```

**Keep Existing Translation Workflow:**

```bash
# Still works!
yarn localize  # Extracts strings from code
# Edit i18n/*.po files
# Regenerate JSON files
```

**Migration Checklist:**

-   [ ] Install astro-i18next (1h)
-   [ ] Create i18n compatibility layer (2h)
-   [ ] Test with existing translations (2h)
-   [ ] Update language switcher (2h)
-   [ ] Test RTL languages (1h)
-   [ ] Document for team (1h)

**Time Estimate: 9-11 hours**

---

## 3. Incremental Migration Phases

### Phase 0: Proof of Concept (Week 1) - 20-24 hours

**Goal:** Validate approach, set up infrastructure, migrate ONE simple page.

#### Tasks

**0.1 Project Setup (6-8h)**

-   [ ] Create `astro-app/` directory
-   [ ] Initialize Astro project: `npm create astro@latest astro-app`
-   [ ] Install dependencies: react, @astrojs/react, nanostores
-   [ ] Configure `astro.config.mjs` (see 2.4.3)
-   [ ] Configure `tsconfig.json` with path aliases
-   [ ] Set up dev proxy for DHIS2
-   [ ] Create `.env` files

```bash
cd astro-app
npm create astro@latest .
npm install react react-dom @astrojs/react @types/react @types/react-dom
npm install nanostores @nanostores/react
npm install @astrojs/sitemap
```

**0.2 Shared Code Integration (4-5h)**

-   [ ] Configure TypeScript paths to `../src/domain`, `../src/data`
-   [ ] Test importing domain entities
-   [ ] Create server composition root (see 2.3)
-   [ ] Test DHIS2 API connection at build time
-   [ ] Create client API wrapper for islands

```typescript
// Test in astro-app/src/pages/test-api.astro
---
import { getServerCompositionRoot } from '@/lib/composition-root.server';

const root = getServerCompositionRoot();
const result = await root.countries.get.execute().runAsync();
---
<pre>{JSON.stringify(result.data, null, 2)}</pre>
```

**0.3 Base Layout (3-4h)**

-   [ ] Create `astro-app/src/layouts/BaseLayout.astro`
-   [ ] Add meta tags, CSS imports
-   [ ] Create minimal header/footer (static HTML)
-   [ ] Import global styles
-   [ ] Test responsive layout

```astro
---
// astro-app/src/layouts/BaseLayout.astro
import '@/styles/global.css';
import '@/styles/theme.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  {description && <meta name="description" content={description}>}
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
  <header><!-- Minimal header --></header>
  <main>
    <slot />
  </main>
  <footer><!-- Minimal footer --></footer>
</body>
</html>
```

**0.4 Migrate About Page (4-5h)**

-   [ ] Audit `src/webapp/pages/about/AboutPage.tsx`
-   [ ] Identify static vs interactive parts
-   [ ] Create `astro-app/src/pages/about.astro`
-   [ ] Extract data fetching logic
-   [ ] Migrate static content
-   [ ] Keep interactive parts as React islands (if any)
-   [ ] Test page loads correctly
-   [ ] Verify data from DHIS2

**0.5 Testing & Validation (3-4h)**

-   [ ] Set up Vitest
-   [ ] Write basic component tests
-   [ ] Test build process
-   [ ] Test dev server with proxy
-   [ ] Performance audit (Lighthouse)
-   [ ] Compare with React version

**Deliverables:**

-   ✅ Working Astro setup alongside React app
-   ✅ One migrated page (About)
-   ✅ Proven DHIS2 integration
-   ✅ Team can review and provide feedback

**Success Criteria:**

-   About page renders correctly
-   Data fetches from DHIS2 at build time
-   Page loads faster than React version
-   Dev workflow is smooth

---

### Phase 1: Core Infrastructure (Week 2) - 24-28 hours

**Goal:** Build reusable infrastructure, no page migration yet.

#### 1.1 Composition Root & Data Layer (8-10h)

-   [ ] Implement server composition root (see 2.3)
-   [ ] Create client composition root
-   [ ] Build API route handlers (`/api/*`)
-   [ ] Create data fetching utilities
-   [ ] Implement caching strategy
-   [ ] Error handling for build-time fetching

```typescript
// astro-app/src/lib/data-fetching.ts
import { getServerCompositionRoot } from "./composition-root.server";

export async function fetchCountries() {
    const root = getServerCompositionRoot();
    const result = await root.countries.get.execute().runAsync();
    if (result.type === "error") {
        throw new Error(`Failed to fetch countries: ${result.message}`);
    }
    return result.data || [];
}

export async function fetchCountryById(id: string) {
    const countries = await fetchCountries();
    return countries.find(c => c.id === id);
}

// Add more data fetching functions...
```

#### 1.2 Component Library Foundation (6-8h)

-   [ ] Create component inventory spreadsheet
-   [ ] Categorize: Static / Interactive / Mixed
-   [ ] Create component migration templates
-   [ ] Set up Material-UI theme wrapper for islands
-   [ ] Create common Astro components (Button, Card, etc.)
-   [ ] Document patterns for team

**Component Categories:**

| Category     | Strategy                | Example             | Count |
| ------------ | ----------------------- | ------------------- | ----- |
| Pure Static  | Migrate to .astro       | PageHeader          | ~20   |
| Interactive  | React island            | SearchInput         | ~15   |
| Data Display | Astro + optional island | CountryList         | ~25   |
| Complex      | Keep React              | PolicyExplorerTable | ~10   |

#### 1.3 Styling System (5-6h)\*\*

-   [ ] Extract theme to CSS custom properties
-   [ ] Create global styles
-   [ ] Set up Astro scoped styles
-   [ ] Configure styled-components for islands
-   [ ] Create style utilities
-   [ ] Document styling approach

```css
/* astro-app/src/styles/theme.css */
:root {
    /* Colors */
    --color-primary: #3f51b5;
    --color-primary-dark: #303f9f;
    --color-primary-light: #7986cb;
    --color-accent: #f50057;
    --color-text: #212121;
    --color-text-secondary: #757575;
    --color-divider: #bdbdbd;
    --color-background: #fafafa;

    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;

    /* Typography */
    --font-family: "Roboto", sans-serif;
    --font-size-base: 16px;
    --line-height-base: 1.5;

    /* Breakpoints (for reference) */
    --breakpoint-sm: 600px;
    --breakpoint-md: 960px;
    --breakpoint-lg: 1280px;
    --breakpoint-xl: 1920px;
}
```

#### 1.4 i18n Setup (4-5h)

-   [ ] Implement i18n solution (see 2.5)
-   [ ] Create translation utilities
-   [ ] Test with existing translations
-   [ ] Create language switcher component
-   [ ] Document usage for islands

#### 1.5 Testing Infrastructure (3-4h)

-   [ ] Configure Vitest (see 2.4.2)
-   [ ] Create test utilities
-   [ ] Write example tests
-   [ ] Set up test coverage
-   [ ] Update CI/CD for dual testing

**Deliverables:**

-   ✅ Complete infrastructure for page migration
-   ✅ Reusable utilities and patterns
-   ✅ Testing framework ready
-   ✅ Documentation for team

---

### Phase 2: Static Pages Migration (Week 3) - 28-32 hours

**Goal:** Migrate all simple, mostly-static pages.

#### 2.1 Methods Page (6-7h)

**Current:** `src/webapp/pages/methods/MethodsPage.tsx`

**Analysis:**

-   Fetches methods data from DHIS2
-   Displays list of method experts
-   Mostly static content

**Implementation:**

```astro
---
// astro-app/src/pages/methods.astro
import Layout from '@/layouts/Layout.astro';
import { fetchMethods } from '@/lib/data-fetching';
import MethodCard from '@/components/MethodCard.astro';

const methods = await fetchMethods();
---
<Layout title="Methods" description="UHC measurement methods">
  <div class="methods-page">
    <h1>Methods</h1>
    <div class="methods-grid">
      {methods.map(method => (
        <MethodCard method={method} />
      ))}
    </div>
  </div>
</Layout>

<style>
  .methods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }
</style>
```

**Tasks:**

-   [ ] Create data fetching function
-   [ ] Migrate layout
-   [ ] Create MethodCard component
-   [ ] Test data rendering
-   [ ] Verify styling

#### 2.2 Resources Landing Page (6-7h)

**Current:** `src/webapp/pages/resources/landing/ResourcesPage.tsx`

**Analysis:**

-   Displays resource categories
-   Has carousel (interactive)
-   Filter/search functionality

**Implementation:**

-   Main layout: Astro
-   Carousel: React island with `client:visible`
-   Search: React island with `client:load`

```astro
---
import Layout from '@/layouts/Layout.astro';
import { fetchResources, fetchResourceThemes } from '@/lib/data-fetching';
import ResourcesCarousel from '@/islands/ResourcesCarousel';
import ResourcesSearch from '@/islands/ResourcesSearch';

const resources = await fetchResources();
const themes = await fetchResourceThemes();
---
<Layout title="Resources">
  <h1>Resources</h1>

  <!-- Interactive search -->
  <ResourcesSearch client:load resources={resources} themes={themes} />

  <!-- Lazy-loaded carousel -->
  <ResourcesCarousel client:visible resources={resources} />

  <!-- Static content -->
  <div class="resource-categories">
    <!-- ... -->
  </div>
</Layout>
```

**Tasks:**

-   [ ] Migrate page structure
-   [ ] Convert carousel to island
-   [ ] Convert search to island
-   [ ] Test interactivity
-   [ ] Verify hydration works

#### 2.3 Home Page (8-10h)

**Current:** `src/webapp/pages/home/HomePage.tsx` (Desktop + Mobile versions)

**Analysis:**

-   Complex layout
-   Map component (Mapbox - interactive)
-   Multiple sections
-   Responsive variants

**Implementation Strategy:**

-   Create responsive Astro layout
-   Map as React island (`client:load` or `client:visible`)
-   Static hero section
-   Dynamic country selector

```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/home/Hero.astro';
import Map from '@/islands/Map';
import { fetchCountries, fetchHomePageContent } from '@/lib/data-fetching';

const countries = await fetchCountries();
const content = await fetchHomePageContent();
---
<Layout title="Universal Health Coverage">
  <Hero content={content.hero} />

  <!-- Interactive map -->
  <Map
    client:load
    countries={countries}
    mapboxToken={import.meta.env.PUBLIC_MAPBOX_TOKEN}
  />

  <!-- Rest of content... -->
</Layout>
```

**Tasks:**

-   [ ] Audit mobile vs desktop differences
-   [ ] Create responsive layout
-   [ ] Migrate Hero section
-   [ ] Convert Map to island
-   [ ] Handle browser-specific code in Map
-   [ ] Test on mobile devices
-   [ ] Verify analytics tracking

#### 2.4 Resources By Type (4-5h)

**Current:** `src/webapp/pages/resources/by-type/ResourcesByTypePage.tsx`

**Dynamic route:** `/resources/[category]`

```astro
---
// astro-app/src/pages/resources/[category].astro
import Layout from '@/layouts/Layout.astro';
import { fetchResourcesByCategory } from '@/lib/data-fetching';

export async function getStaticPaths() {
  const categories = ['news', 'multimedia', 'country-analysis', 'comparative-analysis'];
  return categories.map(category => ({
    params: { category },
  }));
}

const { category } = Astro.params;
const resources = await fetchResourcesByCategory(category);
---
<Layout title={`Resources - ${category}`}>
  <!-- Page content -->
</Layout>
```

**Tasks:**

-   [ ] Implement getStaticPaths
-   [ ] Create category pages
-   [ ] Test all routes
-   [ ] Verify 404 handling

#### 2.5 404 & Error Pages (2-3h)

-   [ ] Create `astro-app/src/pages/404.astro`
-   [ ] Style error page
-   [ ] Test navigation to invalid routes

**Deliverables:**

-   ✅ 4-5 pages migrated
-   ✅ Mix of static and interactive patterns proven
-   ✅ Team comfortable with Astro patterns

---

### Phase 3: Dynamic Pages (Week 4) - 32-38 hours

**Goal:** Migrate dynamic routes with complex data requirements.

#### 3.1 Country/Regional Pages (16-20h)

**Current:** `src/webapp/pages/country-or-regional/CountryOrRegionalPage.tsx`

**Challenge:** ~50 country pages + sub-regions

**Implementation:**

```astro
---
// astro-app/src/pages/[countryOrRegion].astro
import Layout from '@/layouts/Layout.astro';
import CountryHeader from '@/components/country/CountryHeader.astro';
import CountrySlider from '@/islands/CountrySlider';
import CountryResources from '@/components/country/CountryResources.astro';
import CountryExpert from '@/islands/CountryExpert';
import {
  fetchCountries,
  fetchCountryInfo,
  fetchCountrySliderInfo,
  fetchCountryResources,
  fetchCountryExperts
} from '@/lib/data-fetching';

export async function getStaticPaths() {
  const countries = await fetchCountries();
  const subregions = countries.flatMap(c => c.children || []);
  const allPages = [...countries, ...subregions];

  return allPages.map(country => ({
    params: { countryOrRegion: country.id },
    props: { country }
  }));
}

const { country } = Astro.props;
const info = await fetchCountryInfo(country.id);
const sliderData = await fetchCountrySliderInfo(country.id);
const resources = await fetchCountryResources(country.id);
const experts = await fetchCountryExperts(country.id);
---
<Layout title={country.name}>
  <CountryHeader country={country} info={info} />

  <!-- Slider with tabs - interactive -->
  <CountrySlider
    client:load
    data={sliderData}
    countryId={country.id}
  />

  <!-- Resources section - static -->
  <CountryResources resources={resources} />

  <!-- Expert section - might need interactivity -->
  <CountryExpert
    client:visible
    experts={experts}
  />
</Layout>
```

**Key Challenges:**

-   Browser references in slider (document.getElementById)
-   Complex tab navigation state
-   Highcharts in some country pages

**Solutions:**

-   Wrap slider in React island
-   Use `client:load` for immediate interactivity
-   Guard all browser API access
-   Pre-fetch all data at build time

**Tasks:**

-   [ ] Implement getStaticPaths for all countries (3h)
-   [ ] Migrate CountryHeader (static) (3h)
-   [ ] Convert slider to React island (5h)
    -   [ ] Guard document.getElementById
    -   [ ] Test tab navigation
-   [ ] Migrate resources section (2h)
-   [ ] Convert expert section to island (3h)
-   [ ] Test 5 representative countries (2h)
-   [ ] Verify all countries build correctly (2h)

#### 3.2 Handle Browser APIs in Islands (8-10h)

**Affected Components:**

-   ScrollToTopButton
-   MobileSlider
-   Map
-   Any analytics tracking

**Refactoring Pattern:**

```tsx
// Before (breaks SSR)
function ScrollToTopButton() {
    const [visible, setVisible] = useState(window.scrollY > 300);
    // ...
}

// After (SSR-safe)
function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState("fixed");

    useEffect(() => {
        // Only runs on client
        setVisible(window.scrollY > 300);

        const handleScroll = () => {
            setVisible(window.scrollY > 300);

            const footer = document.getElementById("footer");
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (footerRect.top < windowHeight) {
                    setPosition("absolute");
                } else {
                    setPosition("fixed");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position }}>
            ↑
        </button>
    );
}
```

**Tasks:**

-   [ ] Audit all browser API usage (2h)
-   [ ] Refactor ScrollToTopButton (1h)
-   [ ] Refactor MobileSlider (2h)
-   [ ] Refactor Map component (2h)
-   [ ] Create useClientOnly hook (1h)
-   [ ] Test all refactored components (2h)

**Utility Hook:**

```tsx
// astro-app/src/islands/hooks/useClientOnly.ts
import { useEffect, useState } from "react";

export function useClientOnly() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}

// Usage
function MyComponent() {
    const isClient = useClientOnly();

    if (!isClient) return <div>Loading...</div>;

    return <div>{window.location.href}</div>;
}
```

#### 3.3 Regional Page Variant (4-5h)

-   [ ] Test regional page rendering
-   [ ] Verify sub-region navigation
-   [ ] Check data differences vs country pages

**Deliverables:**

-   ✅ All country/regional pages working
-   ✅ Browser API issues resolved
-   ✅ Dynamic routing proven at scale

---

### Phase 4: Complex Interactive Pages (Week 5) - 36-42 hours

**Goal:** Migrate pages with heavy interactivity.

#### 4.1 Policy Explorer (16-20h)

**Current:** `src/webapp/pages/policy-explorer/PolicyExplorerPage.tsx`

**Analysis:**

-   Complex filtering
-   Data table with sorting
-   Export functionality
-   URL query params for state

**Strategy: Hybrid Approach**

```astro
---
// astro-app/src/pages/policy-explorer.astro
import Layout from '@/layouts/Layout.astro';
import PolicyExplorerApp from '@/islands/PolicyExplorerApp';
import {
  fetchPolicyExplorerData,
  fetchPolicyExplorerCategories
} from '@/lib/data-fetching';

const data = await fetchPolicyExplorerData();
const categories = await fetchPolicyExplorerCategories();
---
<Layout title="Policy Explorer">
  <div class="policy-explorer-intro">
    <h1>Policy Explorer</h1>
    <p><!-- Static intro text --></p>
  </div>

  <!-- Entire app as React island -->
  <PolicyExplorerApp
    client:load
    initialData={data}
    categories={categories}
  />
</Layout>
```

**Island Implementation:**

```tsx
// astro-app/src/islands/PolicyExplorerApp.tsx
import { useState, useMemo } from "react";
import { MaterialUIWrapper } from "./MaterialUIWrapper";
import PolicyExplorerTable from "./PolicyExplorerTable";
import PolicyExplorerFilters from "./PolicyExplorerFilters";

export default function PolicyExplorerApp({ initialData, categories }) {
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useState("");

    // Parse URL params on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            // Initialize from URL
        }
    }, []);

    const filteredData = useMemo(() => {
        // Apply filters
        return initialData.filter(/* ... */);
    }, [initialData, filters]);

    return (
        <MaterialUIWrapper>
            <PolicyExplorerFilters categories={categories} filters={filters} onChange={setFilters} />
            <PolicyExplorerTable data={filteredData} />
        </MaterialUIWrapper>
    );
}
```

**Tasks:**

-   [ ] Extract policy explorer as standalone island (4h)
-   [ ] Ensure Material-UI theme works (2h)
-   [ ] Handle URL query params client-side (3h)
-   [ ] Test filtering (2h)
-   [ ] Test sorting (2h)
-   [ ] Test export functionality (3h)
-   [ ] Performance testing with large datasets (2h)
-   [ ] Write tests for island (2h)

#### 4.2 Indicator Explorer (16-20h)

**Current:** `src/webapp/pages/indicator-explorer/IndicatorExplorerPage.tsx`

**Analysis:**

-   Highcharts visualizations
-   Analytics data from DHIS2
-   Dynamic indicator selection
-   Chart download functionality

**Strategy: Heavy React Island**

```astro
---
// astro-app/src/pages/indicator-explorer.astro
import Layout from '@/layouts/Layout.astro';
import IndicatorExplorerApp from '@/islands/IndicatorExplorerApp';
import {
  fetchIndicators,
  fetchVisualizationData,
  fetchLegendSets
} from '@/lib/data-fetching';

const indicators = await fetchIndicators();
const visualizations = await fetchVisualizationData();
const legendSets = await fetchLegendSets();
---
<Layout title="Indicator Explorer">
  <!-- Static intro -->
  <div class="indicator-intro">
    <h1>Indicator Explorer</h1>
  </div>

  <!-- Entire interactive app -->
  <IndicatorExplorerApp
    client:load
    indicators={indicators}
    visualizations={visualizations}
    legendSets={legendSets}
  />
</Layout>
```

**Tasks:**

-   [ ] Wrap entire explorer as React island (3h)
-   [ ] Integrate Highcharts (test client-side only) (4h)
-   [ ] Handle dynamic data loading (use API endpoints) (4h)
-   [ ] Test chart rendering (2h)
-   [ ] Test indicator selection (2h)
-   [ ] Test download functionality (2h)
-   [ ] Optimize bundle size (2h)
-   [ ] Write tests (2h)

#### 4.3 Create API Endpoints for Dynamic Data (4-5h)

Some data might need to be fetched client-side after user interaction:

```typescript
// astro-app/src/pages/api/analytics/[...params].ts
import type { APIRoute } from "astro";
import { getServerCompositionRoot } from "@/lib/composition-root.server";

export const GET: APIRoute = async ({ params, request }) => {
    const url = new URL(request.url);
    const indicatorId = url.searchParams.get("indicator");
    const period = url.searchParams.get("period");

    const root = getServerCompositionRoot();
    const result = await root.analytics.get.execute({ indicatorId, period }).runAsync();

    if (result.type === "error") {
        return new Response(JSON.stringify({ error: result.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result.data), {
        headers: { "Content-Type": "application/json" },
    });
};
```

**Tasks:**

-   [ ] Create analytics API endpoint (2h)
-   [ ] Create download API endpoint (1h)
-   [ ] Test endpoints (1h)
-   [ ] Document API for islands (1h)

**Deliverables:**

-   ✅ Policy Explorer fully functional
-   ✅ Indicator Explorer fully functional
-   ✅ Complex interactivity working
-   ✅ Performance acceptable

---

### Phase 5: Styling & Polish (Week 6) - 20-24 hours

**Goal:** Refine styles, migrate remaining components, polish UX.

#### 5.1 Component Styling Migration (10-12h)

**Migrate Static Components to Astro Styles:**

Priority list (from styled-components → Astro):

1. PageHeader
2. Hero sections
3. Cards
4. Layout components
5. Typography components

**Example Migration:**

```tsx
// Before: src/webapp/components/page-header/PageHeader.tsx
import styled from "styled-components";

const Container = styled.div`
    padding: 24px;
    background: #f5f5f5;
`;

const Title = styled.h1`
    font-size: 32px;
    color: #333;
`;

export function PageHeader({ title }) {
    return (
        <Container>
            <Title>{title}</Title>
        </Container>
    );
}
```

```astro
<!-- After: astro-app/src/components/PageHeader.astro -->
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---
<div class="page-header">
  <h1 class="title">{title}</h1>
</div>

<style>
  .page-header {
    padding: var(--spacing-lg);
    background: var(--color-background);
  }

  .title {
    font-size: 32px;
    color: var(--color-text);
    margin: 0;
  }
</style>
```

**Tasks:**

-   [ ] Identify 20 static components (1h)
-   [ ] Migrate 5 components per session (8h total)
-   [ ] Test visual consistency (2h)
-   [ ] Update component documentation (1h)

#### 5.2 Responsive Design Verification (4-5h)

-   [ ] Test all pages on mobile (320px, 375px, 768px)
-   [ ] Test on tablet (768px, 1024px)
-   [ ] Test on desktop (1280px, 1920px)
-   [ ] Fix any responsive issues
-   [ ] Test touch interactions

#### 5.3 Accessibility Audit (3-4h)

-   [ ] Run axe DevTools on all pages
-   [ ] Fix aria labels
-   [ ] Ensure keyboard navigation
-   [ ] Test with screen reader
-   [ ] Fix color contrast issues

#### 5.4 Performance Optimization (3-4h)

-   [ ] Analyze bundle sizes
-   [ ] Lazy-load heavy components
-   [ ] Optimize images (use Astro Image)
-   [ ] Minimize JavaScript payload
-   [ ] Test Core Web Vitals

**Deliverables:**

-   ✅ Consistent styling across all pages
-   ✅ Responsive design works
-   ✅ Accessibility score >90
-   ✅ Performance score >90

---

### Phase 6: Testing & Quality Assurance (Week 6-7) - 24-28 hours

#### 6.1 Unit Testing (10-12h)

-   [ ] Write tests for new Astro components (4h)
-   [ ] Write tests for React islands (4h)
-   [ ] Test data fetching utilities (2h)
-   [ ] Test composition root (2h)
-   [ ] Achieve 80%+ coverage

#### 6.2 Integration Testing (8-10h)

-   [ ] Update Cypress tests for new URLs (3h)
-   [ ] Test user flows (navigation, search, filtering) (3h)
-   [ ] Test form submissions (if any) (2h)
-   [ ] Test analytics tracking (2h)

#### 6.3 Cross-Browser Testing (4-5h)

-   [ ] Test on Chrome/Edge
-   [ ] Test on Firefox
-   [ ] Test on Safari
-   [ ] Test on mobile browsers
-   [ ] Fix any browser-specific issues

#### 6.4 Data Integrity Testing (2-3h)

-   [ ] Verify all DHIS2 data renders correctly
-   [ ] Test with production-like data
-   [ ] Verify filtering/sorting accuracy
-   [ ] Test edge cases (missing data, etc.)

**Deliverables:**

-   ✅ Comprehensive test suite
-   ✅ All tests passing
-   ✅ Cross-browser compatibility
-   ✅ Data integrity verified

---

### Phase 7: Deployment & Cutover (Week 7) - 16-20 hours

#### 7.1 Build Configuration (4-5h)

-   [ ] Optimize production build
-   [ ] Configure build caching
-   [ ] Set up incremental builds (if supported)
-   [ ] Test build locally
-   [ ] Document build process

```json
// package.json
{
    "scripts": {
        "dev": "cd astro-app && astro dev",
        "build": "cd astro-app && astro build",
        "preview": "cd astro-app && astro preview",
        "build:old": "react-scripts build"
        // Keep both during transition
    }
}
```

#### 7.2 CI/CD Update (4-5h)

-   [ ] Update GitHub Actions / CI pipeline
-   [ ] Add Astro build step
-   [ ] Configure environment variables
-   [ ] Test CI build
-   [ ] Set up preview deployments

```yaml
# .github/workflows/build.yml
name: Build Astro App
on: [push]
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
            - run: npm install
            - run: npm run build
              env:
                  DHIS2_BASE_URL: ${{ secrets.DHIS2_BASE_URL }}
                  DHIS2_AUTH: ${{ secrets.DHIS2_AUTH }}
            - uses: actions/upload-artifact@v3
              with:
                  name: dist
                  path: astro-app/dist
```

#### 7.3 DHIS2 Deployment Configuration (3-4h)

-   [ ] Test build output structure
-   [ ] Ensure manifest.webapp is correct
-   [ ] Test deployment to DHIS2 instance
-   [ ] Verify routing works in DHIS2 context
-   [ ] Document deployment process

#### 7.4 Cutover Plan (2-3h)

-   [ ] Create rollback plan
-   [ ] Schedule deployment window
-   [ ] Notify stakeholders
-   [ ] Create deployment checklist
-   [ ] Plan monitoring strategy

#### 7.5 Final Testing & Go-Live (3-4h)

-   [ ] Deploy to staging
-   [ ] Run smoke tests
-   [ ] Get stakeholder approval
-   [ ] Deploy to production
-   [ ] Monitor for issues
-   [ ] Document any post-launch issues

**Deliverables:**

-   ✅ Production-ready build
-   ✅ Successful deployment to DHIS2
-   ✅ Monitoring in place
-   ✅ Team trained on new system

---

### Phase 8: Cleanup & Documentation (Week 8) - 12-16 hours

#### 8.1 Code Cleanup (4-5h)

-   [ ] Remove old React app code (after verification)
-   [ ] Clean up unused dependencies
-   [ ] Remove old build configurations
-   [ ] Update .gitignore
-   [ ] Clean up package.json

#### 8.2 Documentation (6-8h)

-   [ ] Update README.md
-   [ ] Document new architecture
-   [ ] Create developer guide
-   [ ] Document component patterns
-   [ ] Document data fetching patterns
-   [ ] Create troubleshooting guide
-   [ ] Document deployment process

````markdown
# UHCPW - Astro Version

## Quick Start

```bash
npm install
npm run dev  # Starts Astro dev server on :4321
```
````

## Architecture

-   **Framework:** Astro 4.x with React islands
-   **Routing:** File-based (src/pages/)
-   **Data:** Fetched at build time from DHIS2
-   **Interactivity:** React islands with selective hydration

## Adding a New Page

1. Create file in `astro-app/src/pages/`
2. Fetch data in frontmatter
3. Use React islands for interactivity

## Testing

```bash
npm test          # Run all tests
npm run test:unit # Vitest
npm run test:e2e  # Cypress
```

## Deployment

```bash
npm run build  # Generates static site in astro-app/dist
```

Deploy `dist/` folder to DHIS2.

````

#### 8.3 Knowledge Transfer (2-3h)
- [ ] Conduct code walkthrough with team
- [ ] Answer questions
- [ ] Demonstrate dev workflow
- [ ] Explain gotchas and patterns

**Deliverables:**
- ✅ Clean codebase
- ✅ Comprehensive documentation
- ✅ Team trained
- ✅ Project complete!

---

## 4. Technical Implementation Details

### 4.1 Development Workflow

**During Migration (Phases 0-6):**

```bash
# Terminal 1: React app (old)
npm start  # Runs on :8081

# Terminal 2: Astro app (new)
cd astro-app
npm run dev  # Runs on :4321

# Can test both simultaneously
````

**After Migration (Phase 7+):**

```bash
npm run dev  # Astro only
npm run build
npm run preview  # Test production build
```

### 4.2 Common Patterns

#### Pattern 1: Static Page with Data

```astro
---
// Fetch data at build time
import { fetchData } from '@/lib/data-fetching';
const data = await fetchData();
---
<Layout>
  <h1>{data.title}</h1>
  {data.items.map(item => (
    <div>{item.name}</div>
  ))}
</Layout>
```

#### Pattern 2: Page with Interactive Island

```astro
---
import InteractiveComponent from '@/islands/InteractiveComponent';
const staticData = await fetchData();
---
<Layout>
  <div class="static-intro">
    <h1>{staticData.title}</h1>
  </div>

  <InteractiveComponent
    client:load
    data={staticData}
  />
</Layout>
```

#### Pattern 3: Dynamic Routes

```astro
---
export async function getStaticPaths() {
  const items = await fetchAllItems();
  return items.map(item => ({
    params: { id: item.id },
    props: { item }
  }));
}

const { item } = Astro.props;
---
<Layout title={item.name}>
  <!-- Content -->
</Layout>
```

#### Pattern 4: Client-Side Data Fetching

```tsx
// Island that fetches additional data
export function DynamicIsland({ initialData }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        setLoading(true);
        const response = await fetch("/api/more-data");
        const newData = await response.json();
        setData([...data, ...newData]);
        setLoading(false);
    };

    return (
        <div>
            {/* Render data */}
            <button onClick={loadMore}>Load More</button>
        </div>
    );
}
```

### 4.3 Hydration Strategies

**Client Directives:**

```astro
<!-- Load immediately -->
<Component client:load />

<!-- Load when visible (intersection observer) -->
<Component client:visible />

<!-- Load when browser is idle -->
<Component client:idle />

<!-- Load on media query -->
<Component client:media="(max-width: 768px)" />

<!-- Only render on client, skip SSR -->
<Component client:only="react" />
```

**When to Use:**

| Directive        | Use Case               | Example         |
| ---------------- | ---------------------- | --------------- |
| `client:load`    | Critical interactivity | Search, filters |
| `client:visible` | Below fold content     | Carousels, maps |
| `client:idle`    | Non-critical features  | Analytics, chat |
| `client:only`    | Heavy browser APIs     | Mapbox, charts  |

### 4.4 Error Handling

```typescript
// astro-app/src/lib/error-handling.ts
export async function safeDataFetch<T>(fetchFn: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await fetchFn();
    } catch (error) {
        console.error("Data fetch error:", error);
        // Could send to error tracking service
        return fallback;
    }
}

// Usage
const countries = await safeDataFetch(
    () => fetchCountries(),
    [] // fallback value
);
```

---

## 5. Testing Strategy

### 5.1 Test Types

**Unit Tests (Vitest)**

-   Astro components (with fixtures)
-   React islands
-   Utility functions
-   Domain/Data layers

**Integration Tests (Cypress)**

-   User flows
-   Navigation
-   Form interactions
-   Data integrity

**Visual Tests (Optional)**

-   Percy or Chromatic
-   Screenshot comparison

### 5.2 Example Tests

```typescript
// astro-app/src/components/PageHeader.test.ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import PageHeader from "./PageHeader.astro";

test("PageHeader renders title", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PageHeader, {
        props: { title: "Test Title" },
    });

    expect(result).toContain("Test Title");
});
```

```typescript
// astro-app/src/islands/SearchInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import SearchInput from "./SearchInput";

test("SearchInput calls onChange", async () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(handleChange).toHaveBeenCalledWith("test");
});
```

---

## 6. Risk Mitigation

### 6.1 High-Risk Items

| Risk                              | Impact | Mitigation                                   | Status    |
| --------------------------------- | ------ | -------------------------------------------- | --------- |
| DHIS2 build-time data fetch fails | High   | Implement retries, caching, fallbacks        | Phase 0   |
| Complex islands don't hydrate     | High   | Test incrementally, use client:only fallback | Phase 4   |
| Performance regression            | Medium | Lighthouse CI, bundle analysis               | Phase 5   |
| Browser API issues                | Medium | Comprehensive guards, useEffect patterns     | Phase 3   |
| Styled-components conflicts       | Medium | Keep for islands, migrate static             | Phase 1-2 |

### 6.2 Rollback Plan

**At any phase:**

1. Revert to React build: `npm run build:old`
2. Deploy old dist folder
3. Investigate issue
4. Resume migration when resolved

**After cutover:**

-   Keep React code for 1-2 sprints
-   Monitor production issues
-   Can revert if critical problems arise

---

## 7. Timeline Summary

| Phase                  | Duration     | Key Deliverables                      |
| ---------------------- | ------------ | ------------------------------------- |
| 0. Proof of Concept    | 20-24h       | Astro setup, 1 page migrated          |
| 1. Core Infrastructure | 24-28h       | Composition root, utilities, patterns |
| 2. Static Pages        | 28-32h       | Methods, Resources, Home, 404         |
| 3. Dynamic Pages       | 32-38h       | Country pages, browser API fixes      |
| 4. Interactive Pages   | 36-42h       | Policy Explorer, Indicator Explorer   |
| 5. Styling & Polish    | 20-24h       | Component migration, responsive, a11y |
| 6. Testing & QA        | 24-28h       | Unit, integration, cross-browser      |
| 7. Deployment          | 16-20h       | CI/CD, DHIS2 deployment, go-live      |
| 8. Cleanup & Docs      | 12-16h       | Code cleanup, documentation           |
| **Total**              | **212-252h** | **Full migration complete**           |

**Realistic Estimate: 220-240 hours (5.5-6 weeks)**

### Milestone Schedule

-   **Week 1:** POC complete, team aligned
-   **Week 2:** Infrastructure ready
-   **Week 3:** Half of pages migrated
-   **Week 4:** All pages migrated
-   **Week 5:** Complex pages working
-   **Week 6:** Polish & testing
-   **Week 7:** Deployment
-   **Week 8:** Documentation & cleanup

---

## 8. Success Criteria

### 8.1 Functional Requirements

-   ✅ All pages render correctly
-   ✅ All interactive features work
-   ✅ Data from DHIS2 displays accurately
-   ✅ Navigation works (no HashRouter)
-   ✅ Forms and inputs work
-   ✅ Charts and maps work
-   ✅ Multi-language support works
-   ✅ Export functionality works

### 8.2 Performance Requirements

-   ✅ Lighthouse Performance: >90
-   ✅ First Contentful Paint: <1.2s
-   ✅ Time to Interactive: <2.5s
-   ✅ Total Blocking Time: <200ms
-   ✅ Cumulative Layout Shift: <0.1
-   ✅ Bundle size: 30-50% smaller than React SPA

### 8.3 Quality Requirements

-   ✅ Unit test coverage: >80%
-   ✅ All Cypress tests pass
-   ✅ No console errors
-   ✅ Lighthouse Accessibility: >90
-   ✅ Works in Chrome, Firefox, Safari
-   ✅ Mobile responsive

### 8.4 Developer Experience

-   ✅ Dev server starts quickly
-   ✅ Hot reload works
-   ✅ Clear documentation
-   ✅ Team comfortable with new patterns

---

## 9. Post-Migration Benefits

### 9.1 Performance

-   **Faster page loads:** Static HTML loads instantly
-   **Smaller bundles:** JavaScript only for interactive parts
-   **Better SEO:** Pre-rendered HTML

### 9.2 Developer Experience

-   **Faster development:** File-based routing, less boilerplate
-   **Better DX:** TypeScript, Vite, clear patterns
-   **Easier testing:** Vitest, component isolation

### 9.3 Maintenance

-   **Simpler deploy:** Static files, no server needed
-   **Lower hosting costs:** CDN-friendly
-   **Better scalability:** No server-side load

---

## 10. Appendix

### A. Dependencies to Add

```json
{
    "dependencies": {
        "astro": "^4.5.0",
        "@astrojs/react": "^3.1.0",
        "@astrojs/sitemap": "^3.1.0",
        "nanostores": "^0.10.0",
        "@nanostores/react": "^0.7.1",
        "i18next": "^23.10.0"
    },
    "devDependencies": {
        "@astrojs/check": "^0.5.0",
        "vitest": "^1.4.0",
        "@vitest/ui": "^1.4.0",
        "@testing-library/react": "^14.2.0",
        "@testing-library/jest-dom": "^6.4.0"
    }
}
```

### B. File Structure After Migration

```
uhcpw/
├── astro-app/                 # New Astro app
│   ├── public/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── pages/            # Routes (.astro files)
│   │   │   ├── index.astro
│   │   │   ├── about.astro
│   │   │   ├── methods.astro
│   │   │   ├── [countryOrRegion].astro
│   │   │   ├── policy-explorer.astro
│   │   │   ├── indicator-explorer.astro
│   │   │   ├── resources/
│   │   │   │   ├── index.astro
│   │   │   │   └── [category].astro
│   │   │   └── api/
│   │   │       └── [...].ts
│   │   ├── layouts/
│   │   │   ├── BaseLayout.astro
│   │   │   └── Layout.astro
│   │   ├── components/       # Astro components
│   │   │   ├── PageHeader.astro
│   │   │   ├── Footer.astro
│   │   │   └── ...
│   │   ├── islands/          # React components
│   │   │   ├── PolicyExplorerApp.tsx
│   │   │   ├── IndicatorExplorerApp.tsx
│   │   │   ├── Map.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── composition-root.server.ts
│   │   │   ├── composition-root.client.ts
│   │   │   ├── data-fetching.ts
│   │   │   └── i18n.ts
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── theme.css
│   │   └── test/
│   │       └── setup.ts
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   └── vitest.config.ts
├── src/                      # Shared code
│   ├── domain/              # ✅ Reused as-is
│   ├── data/                # ✅ Reused as-is
│   ├── types/               # ✅ Reused as-is
│   └── utils/               # ✅ Reused as-is
├── package.json
└── README.md
```

### C. Environment Variables

```bash
# .env (shared)
DHIS2_BASE_URL=http://localhost:8080
DHIS2_AUTH=admin:district

# Astro-specific
PUBLIC_MAPBOX_TOKEN=your_token
PUBLIC_GA_ID=your_ga_id
```

### D. Useful Commands

```bash
# Development
npm run dev              # Start Astro dev server
npm run dev:old          # Start React dev server (during migration)

# Building
npm run build            # Build Astro site
npm run preview          # Preview production build

# Testing
npm test                 # Run all tests
npm run test:unit        # Vitest
npm run test:e2e         # Cypress
npm run test:coverage    # Coverage report

# Linting
npm run lint             # ESLint
npm run format           # Prettier

# i18n
npm run localize         # Extract translations (still works!)
```

---

## Document Metadata

-   **Version:** 2.0 (Incremental Approach)
-   **Date:** November 17, 2025
-   **Author:** GitHub Copilot
-   **Status:** Ready for Implementation

**Key Changes from v1.0:**

-   ✅ Fully SSG (no hybrid SSR)
-   ✅ Incremental migration strategy
-   ✅ Addresses all concerns (browser APIs, styled-components, composition root, config, i18n)
-   ✅ Detailed phase-by-phase plan
-   ✅ Can run both apps in parallel
-   ✅ Lower risk with gradual cutover

**Pages Identified:**

-   Home page
-   About page
-   Country/Regional pages (dynamic)
-   Policy Explorer
-   Indicator Explorer
-   Resources (landing + by-type)
-   Methods page
-   404 page

### 1.2 Current Data Flow

```
DHIS2 API → D2Api → Repositories → Use Cases → React Components
```

-   Data fetching happens at runtime
-   Authentication required for DHIS2 connection
-   Context-based state management (AppContext)
-   Composition root for dependency injection

---

## 2. Migration Strategy

### 2.1 Hybrid Approach: Astro Islands + React

**Rationale:**
Given the complexity of DHIS2 integration and interactive components, a full static generation isn't feasible. We'll use Astro's "Islands Architecture" where:

1. **Static parts** → Pure Astro components (header, footer, static content)
2. **Interactive parts** → React components with client-side hydration
3. **Data-heavy parts** → Server-side rendering at build time or on-demand (SSR mode)

### 2.2 Architecture Decision

**Option A: Static Site Generation (SSG) with Hybrid Rendering**

-   Pre-render all possible routes at build time
-   Use Astro's server endpoints for dynamic data
-   Keep React for complex interactive components
-   **Recommended for public-facing content**

**Option B: Server-Side Rendering (SSR)**

-   Deploy to Node.js server
-   Render pages on-demand
-   Better for authenticated content
-   **Recommended if DHIS2 auth is critical**

**Recommendation: Hybrid SSG + SSR**

-   Public pages → SSG (home, about, methods, resources)
-   Dynamic pages → SSR with incremental regeneration
-   Use Astro middleware for DHIS2 authentication

---

## 3. Phase-by-Phase Implementation

### Phase 1: Project Setup & Infrastructure (16-20 hours)

#### 3.1 Initialize Astro Project

**Tasks:**

-   [ ] Create Astro project structure
-   [ ] Configure TypeScript
-   [ ] Set up React integration (`@astrojs/react`)
-   [ ] Configure Node adapter for SSR (`@astrojs/node`)
-   [ ] Set up path aliases matching current structure

**Files to Create:**

```
astro.config.mjs
tsconfig.json (adjust for Astro)
.env.example
```

**Time: 4 hours**

#### 3.2 Build System Configuration

**Tasks:**

-   [ ] Configure Vite for module resolution
-   [ ] Set up asset handling (images, fonts, icons)
-   [ ] Configure CSS/Styled Components support
-   [ ] Set up dev server with proxy for DHIS2 API
-   [ ] Create build scripts

**Time: 4 hours**

#### 3.3 Migration Scripts & Tooling

**Tasks:**

-   [ ] Create component migration checklist
-   [ ] Set up code transformation scripts (if needed)
-   [ ] Configure linting/formatting for Astro files
-   [ ] Update CI/CD pipelines

**Time: 4 hours**

#### 3.4 Testing Infrastructure

**Tasks:**

-   [ ] Configure Vitest for unit tests
-   [ ] Update Cypress configuration for Astro
-   [ ] Create test utilities for Astro components
-   [ ] Set up visual regression testing (optional)

**Time: 4-8 hours**

---

### Phase 2: Core Infrastructure Migration (24-30 hours)

#### 2.1 Clean Architecture Adaptation

**Tasks:**

-   [ ] Migrate domain layer (no changes needed)
-   [ ] Adapt data repositories for server context
-   [ ] Update CompositionRoot for Astro context
-   [ ] Create server-side data fetching utilities
-   [ ] Implement API route handlers in Astro

**Current Structure:**

```
src/
  domain/      ← Keep as-is
  data/        ← Adapt for server/client context
  webapp/      ← Migrate to Astro
```

**New Structure:**

```
src/
  domain/              ← No changes
  data/                ← Adapt with context awareness
  pages/               ← Astro pages (.astro files)
  components/          ← Astro + React components
  layouts/             ← Astro layouts
  api/                 ← Astro API routes
  lib/                 ← Shared utilities
```

**Time: 12 hours**

#### 2.2 Authentication & Session Management

**Tasks:**

-   [ ] Implement Astro middleware for DHIS2 auth
-   [ ] Create session management (cookies/JWT)
-   [ ] Handle authentication redirects
-   [ ] Implement user context in Astro

**Challenges:**

-   DHIS2 authentication in SSR context
-   Session persistence across requests

**Time: 8-12 hours**

#### 2.3 Data Fetching Layer

**Tasks:**

-   [ ] Create Astro data fetching patterns
-   [ ] Implement getStaticPaths for dynamic routes
-   [ ] Set up data caching strategy
-   [ ] Create API endpoints for client-side data
-   [ ] Implement incremental static regeneration (ISR)

**Key Files:**

```typescript
// src/lib/data-fetching.ts
export async function fetchCountries(api: D2Api) { ... }

// src/pages/[country].astro
export async function getStaticPaths() {
  const countries = await fetchCountries();
  return countries.map(country => ({ params: { country: country.id } }));
}
```

**Time: 4-6 hours**

---

### Phase 3: Layout & Common Components (20-24 hours)

#### 3.1 Layout Components

**Tasks:**

-   [ ] Create base Astro layout
-   [ ] Migrate header component
-   [ ] Migrate footer component
-   [ ] Migrate navigation
-   [ ] Implement responsive layout switching

**Files:**

```
src/layouts/
  BaseLayout.astro
  Layout.astro (current Layout.tsx → .astro)
```

**Time: 8 hours**

#### 3.2 Common Components Migration

**Tasks:**

-   [ ] Audit components (static vs interactive)
-   [ ] Migrate static components to Astro
-   [ ] Keep interactive components as React
-   [ ] Create component documentation

**Component Categories:**

| Component Type | Migration Strategy    | Examples             |
| -------------- | --------------------- | -------------------- |
| Static         | Pure Astro            | PageHeader, Footer   |
| Interactive    | React Island          | SearchInput, Filters |
| Mixed          | Astro wrapper + React | ResourcesCarousel    |
| Complex        | Keep React            | Highcharts, Mapbox   |

**Time: 12-16 hours**

---

### Phase 4: Routing & Pages Migration (40-50 hours)

#### 4.1 Static Pages (12 hours)

**Home Page** (`/`)

-   **Current:** `src/webapp/pages/home/HomePage.tsx`
-   **New:** `src/pages/index.astro`
-   **Strategy:** SSG with React islands for interactive parts
-   **Time:** 4 hours

**About Page** (`/about`)

-   **Current:** `src/webapp/pages/about/AboutPage.tsx`
-   **New:** `src/pages/about.astro`
-   **Strategy:** SSG
-   **Time:** 3 hours

**Methods Page** (`/methods`)

-   **Current:** `src/webapp/pages/methods/MethodsPage.tsx`
-   **New:** `src/pages/methods.astro`
-   **Strategy:** SSG with data fetching
-   **Time:** 3 hours

**Resources Landing** (`/resources`)

-   **Current:** `src/webapp/pages/resources/landing/ResourcesPage.tsx`
-   **New:** `src/pages/resources/index.astro`
-   **Strategy:** SSG
-   **Time:** 2 hours

#### 4.2 Dynamic Routes (12-16 hours)

**Country/Regional Pages** (`/[countryOrRegion]`)

-   **Current:** `src/webapp/pages/country-or-regional/CountryOrRegionalPage.tsx`
-   **New:** `src/pages/[countryOrRegion].astro`
-   **Strategy:** SSG with getStaticPaths
-   **Implementation:**
    ```typescript
    export async function getStaticPaths() {
        const api = getServerApi();
        const countries = await fetchCountries(api);
        return countries.map(country => ({
            params: { countryOrRegion: country.id },
            props: { country },
        }));
    }
    ```
-   **Time:** 8-10 hours

**Resources by Type** (`/resources/[category]`)

-   **Strategy:** SSG with dynamic paths
-   **Time:** 4-6 hours

#### 4.3 Complex Interactive Pages (16-22 hours)

**Policy Explorer** (`/policy-explorer`)

-   **Current:** `src/webapp/pages/policy-explorer/PolicyExplorerPage.tsx`
-   **New:** `src/pages/policy-explorer.astro`
-   **Strategy:** Hybrid - Astro wrapper + React component with client:load
-   **Challenges:**
    -   Complex filtering
    -   Dynamic table
    -   Export functionality
-   **Time:** 8-10 hours

**Indicator Explorer** (`/indicator-explorer`)

-   **Current:** `src/webapp/pages/indicator-explorer/IndicatorExplorerPage.tsx`
-   **New:** `src/pages/indicator-explorer.astro`
-   **Strategy:** React island with client:only="react"
-   **Challenges:**
    -   Highcharts integration
    -   Analytics data fetching
    -   Complex state management
-   **Time:** 8-12 hours

#### 4.4 Error Pages

**404 Page**

-   **New:** `src/pages/404.astro`
-   **Time:** 1 hour

---

### Phase 5: SEO & Meta Tags (6-8 hours)

#### 5.1 Meta Tags Implementation

**Tasks:**

-   [ ] Migrate SeoMetaTags component to Astro
-   [ ] Create SEO utility functions
-   [ ] Implement OpenGraph tags
-   [ ] Add structured data (JSON-LD)
-   [ ] Generate sitemap.xml
-   [ ] Create robots.txt

**Implementation:**

```astro
---
// src/components/SEO.astro
import { getSeoConfigForRoute } from '../domain/entities/SeoConfig';

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const { title, description, image } = Astro.props;
const seoConfig = getSeoConfigForRoute(Astro.url.pathname);
---
<head>
  <title>{title || seoConfig.title}</title>
  <meta name="description" content={description || seoConfig.description} />
  <!-- OpenGraph tags -->
  <meta property="og:title" content={title || seoConfig.title} />
  <meta property="og:description" content={description || seoconfig.description} />
  {image && <meta property="og:image" content={image} />}
  <!-- Canonical -->
  <link rel="canonical" href={Astro.url.href} />
</head>
```

**Time: 6-8 hours**

---

### Phase 6: State Management & Interactivity (16-20 hours)

#### 6.1 Global State Migration

**Tasks:**

-   [ ] Replace AppContext with Astro's global store
-   [ ] Implement Nano Stores for client-side state
-   [ ] Create context bridge for React islands
-   [ ] Handle authentication state

**Implementation:**

```typescript
// src/stores/app.ts
import { atom, map } from "nanostores";

export const currentUser = atom<User | null>(null);
export const countries = atom<Country[]>([]);
export const themes = atom<ResourceTheme[]>([]);
```

**Time: 8-10 hours**

#### 6.2 Client-Side Routing & Navigation

**Tasks:**

-   [ ] Remove HashRouter
-   [ ] Implement View Transitions API (optional)
-   [ ] Add loading states
-   [ ] Handle navigation analytics

**Time: 4-5 hours**

#### 6.3 Analytics Integration

**Tasks:**

-   [ ] Migrate Google Analytics integration
-   [ ] Implement page view tracking
-   [ ] Add event tracking
-   [ ] Create analytics utilities

**Time: 4-5 hours**

---

### Phase 7: Styling & Theming (12-16 hours)

#### 7.1 CSS Architecture

**Tasks:**

-   [ ] Evaluate styled-components in Astro
-   [ ] Consider migration to CSS Modules or Tailwind
-   [ ] Ensure Material-UI works with React islands
-   [ ] Migrate global styles
-   [ ] Set up CSS processing pipeline

**Options:**

1. **Keep styled-components** (works in React islands)
2. **Migrate to Astro-scoped styles** (for .astro components)
3. **Hybrid approach** (recommended)

**Time: 8-10 hours**

#### 7.2 Theme Migration

**Tasks:**

-   [ ] Migrate Material-UI theme
-   [ ] Ensure theme context works in islands
-   [ ] Create CSS custom properties for shared values
-   [ ] Test dark mode (if applicable)

**Time: 4-6 hours**

---

### Phase 8: Assets & Static Resources (8-10 hours)

#### 8.1 Asset Management

**Tasks:**

-   [ ] Move assets to `public/` folder
-   [ ] Optimize images with Astro Image
-   [ ] Configure font loading
-   [ ] Set up icon system
-   [ ] Optimize SVGs

**Time: 4-5 hours**

#### 8.2 Internationalization (i18n)

**Tasks:**

-   [ ] Evaluate Astro i18n solutions
-   [ ] Migrate gettext translations
-   [ ] Implement language switcher
-   [ ] Test RTL languages
-   [ ] Generate localized routes

**Options:**

-   `astro-i18next`
-   `@astrojs/i18n` (experimental)
-   Custom solution with existing gettext files

**Time: 4-5 hours**

---

### Phase 9: Data Visualization & Maps (12-16 hours)

#### 9.1 Charts Integration

**Tasks:**

-   [ ] Migrate Highcharts components to React islands
-   [ ] Ensure proper hydration
-   [ ] Test chart responsiveness
-   [ ] Optimize chart bundle size

**Implementation:**

```astro
---
// src/pages/indicator-explorer.astro
import HighchartsComponent from '../components/charts/HighchartsComponent.tsx';
---
<HighchartsComponent client:load data={chartData} />
```

**Time: 6-8 hours**

#### 9.2 Mapbox Integration

**Tasks:**

-   [ ] Migrate Mapbox GL components
-   [ ] Handle map initialization in islands
-   [ ] Test map interactivity
-   [ ] Optimize map assets

**Time: 6-8 hours**

---

### Phase 10: Testing & Quality Assurance (20-24 hours)

#### 10.1 Unit Testing

**Tasks:**

-   [ ] Update unit tests for Astro components
-   [ ] Test React islands in isolation
-   [ ] Test data fetching utilities
-   [ ] Test domain/data layers
-   [ ] Achieve 80%+ coverage

**Time: 10-12 hours**

#### 10.2 Integration Testing

**Tasks:**

-   [ ] Update Cypress tests
-   [ ] Test navigation flows
-   [ ] Test form submissions
-   [ ] Test authentication flows
-   [ ] Test data fetching

**Time: 6-8 hours**

#### 10.3 Performance Testing

**Tasks:**

-   [ ] Run Lighthouse audits
-   [ ] Measure Core Web Vitals
-   [ ] Test load times
-   [ ] Analyze bundle sizes
-   [ ] Test on real devices

**Time: 4 hours**

---

### Phase 11: Deployment & DevOps (8-12 hours)

#### 11.1 Build Configuration

**Tasks:**

-   [ ] Optimize production build
-   [ ] Configure output modes (static/hybrid/server)
-   [ ] Set up environment variables
-   [ ] Create deployment scripts
-   [ ] Configure CDN

**Time: 4-6 hours**

#### 11.2 CI/CD Pipeline

**Tasks:**

-   [ ] Update GitHub Actions / CI pipelines
-   [ ] Add build validation
-   [ ] Configure preview deployments
-   [ ] Set up deployment to production

**Deployment Options:**

-   **SSG:** Netlify, Vercel, Cloudflare Pages
-   **SSR:** Vercel, Netlify Functions, Docker + Node.js

**Time: 4-6 hours**

---

### Phase 12: Documentation & Handoff (8-10 hours)

#### 12.1 Documentation

**Tasks:**

-   [ ] Update README.md
-   [ ] Document new architecture
-   [ ] Create component documentation
-   [ ] Document data fetching patterns
-   [ ] Write migration notes
-   [ ] Create troubleshooting guide

**Time: 6-8 hours**

#### 12.2 Knowledge Transfer

**Tasks:**

-   [ ] Conduct code walkthrough
-   [ ] Document gotchas and learnings
-   [ ] Create video tutorials (optional)

**Time: 2 hours**

---

## 4. Technical Challenges & Solutions

### 4.1 DHIS2 Authentication

**Challenge:** DHIS2 requires authentication, current app uses proxy in development.

**Solutions:**

1. **Server-side auth:** Store credentials in server-side session
2. **API routes:** Create Astro endpoints that proxy DHIS2 requests
3. **Environment-based:** Use environment variables for base URL and auth

```typescript
// src/middleware/auth.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    // Check session/cookies for DHIS2 credentials
    const session = await getSession(context.request);
    if (!session) {
        return context.redirect("/login");
    }
    context.locals.api = createD2Api(session);
    return next();
});
```

### 4.2 Dynamic Data Fetching

**Challenge:** Many pages depend on runtime data from DHIS2.

**Solutions:**

1. **Build-time data:** Fetch during build for static pages
2. **Incremental Static Regeneration:** Re-build pages periodically
3. **Server endpoints:** Create API routes for client-side fetching
4. **Hybrid mode:** SSR for authenticated pages, SSG for public

### 4.3 Complex Interactive Components

**Challenge:** Policy Explorer, Indicator Explorer have complex state.

**Solutions:**

1. **Keep as React islands** with `client:load` or `client:only`
2. **Minimal Astro wrapper** for layout and SEO
3. **Shared state** via Nano Stores

### 4.4 Material-UI in Astro

**Challenge:** Material-UI requires ThemeProvider context.

**Solutions:**

1. **Wrap islands in ThemeProvider**
2. **Create a ThemeWrapper component**
3. **Consider migrating to CSS Modules** for static components

```tsx
// src/components/MaterialUIWrapper.tsx
import { ThemeProvider } from "@material-ui/core/styles";
import { muiTheme } from "./themes/dhis2.theme";

export function MaterialUIWrapper({ children }) {
    return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
```

### 4.5 Styled Components SSR

**Challenge:** styled-components needs special SSR setup.

**Solutions:**

1. **Use Astro's built-in scoped styles** where possible
2. **Keep styled-components for React islands**
3. **Extract styles during SSR** (if needed)

### 4.6 Client-Side State Synchronization

**Challenge:** Sharing state between islands and Astro.

**Solutions:**

1. **Use Nano Stores** (lightweight reactive stores)
2. **Custom events** for communication
3. **Shared props** from server-rendered data

---

## 5. Risk Assessment

### High Risk Items

| Risk                            | Impact | Mitigation                             | Time Buffer |
| ------------------------------- | ------ | -------------------------------------- | ----------- |
| DHIS2 authentication complexity | High   | Prototype auth early, use SSR mode     | +8 hours    |
| Complex state in explorers      | High   | Keep as React islands, minimal changes | +4 hours    |
| Material-UI integration issues  | Medium | Test early, have fallback plan         | +4 hours    |
| Data fetching performance       | Medium | Implement caching, ISR                 | +4 hours    |
| Testing coverage gaps           | Medium | Prioritize critical paths              | +6 hours    |

### Medium Risk Items

| Risk                      | Impact | Mitigation               | Time Buffer |
| ------------------------- | ------ | ------------------------ | ----------- |
| Styled-components SSR     | Medium | Use hybrid approach      | +2 hours    |
| i18n complexity           | Medium | Use proven library       | +2 hours    |
| Build time for many pages | Low    | Use parallel builds, ISR | +2 hours    |

**Total Risk Buffer: +32 hours**

---

## 6. Success Criteria

### 6.1 Functional Requirements

-   ✅ All pages render correctly
-   ✅ All interactive features work
-   ✅ Authentication flows work
-   ✅ Data fetching works (both build-time and runtime)
-   ✅ Navigation works without HashRouter
-   ✅ Forms and user inputs work
-   ✅ Charts and maps render correctly
-   ✅ Multi-language support works
-   ✅ Export functionality works

### 6.2 Performance Requirements

-   ✅ Lighthouse score: >90 for performance
-   ✅ First Contentful Paint: <1.5s
-   ✅ Time to Interactive: <3s
-   ✅ Bundle size reduction: >20%
-   ✅ Build time: <10 minutes

### 6.3 SEO Requirements

-   ✅ All pages have proper meta tags
-   ✅ OpenGraph tags implemented
-   ✅ Sitemap generated
-   ✅ Canonical URLs set
-   ✅ Structured data where applicable

### 6.4 Quality Requirements

-   ✅ Unit test coverage: >80%
-   ✅ Integration tests pass: 100%
-   ✅ No console errors
-   ✅ Accessibility score: >90
-   ✅ Cross-browser compatibility

---

## 7. Timeline Summary

| Phase                         | Duration | Dependencies |
| ----------------------------- | -------- | ------------ |
| 1. Setup & Infrastructure     | 16-20h   | None         |
| 2. Core Infrastructure        | 24-30h   | Phase 1      |
| 3. Layout & Common Components | 20-24h   | Phase 2      |
| 4. Routing & Pages            | 40-50h   | Phase 3      |
| 5. SEO & Meta Tags            | 6-8h     | Phase 4      |
| 6. State & Interactivity      | 16-20h   | Phase 4      |
| 7. Styling & Theming          | 12-16h   | Phase 3      |
| 8. Assets & i18n              | 8-10h    | Phase 3      |
| 9. Data Viz & Maps            | 12-16h   | Phase 4      |
| 10. Testing & QA              | 20-24h   | Phase 9      |
| 11. Deployment & DevOps       | 8-12h    | Phase 10     |
| 12. Documentation             | 8-10h    | Phase 11     |
| **Risk Buffer**               | +32h     | -            |

**Total: 192-272 hours (24-34 working days)**

**Realistic Estimate for Senior Developer: 200-240 hours (5-6 weeks)**

---

## 8. Alternative Approaches

### 8.1 Keep It Simple: Minimal Migration

**If full migration is too risky:**

-   Keep React SPA
-   Use Astro just for static pages (About, Methods)
-   Deploy SPA alongside Astro static pages
-   **Time: 40-60 hours**

### 8.2 Gradual Migration

**Phase 1:** Static pages only (Home, About, Methods)
**Phase 2:** Add SSR for dynamic pages
**Phase 3:** Migrate complex pages

-   **Time: Spread over 3-6 months**

### 8.3 Hybrid Deployment

-   Static marketing pages → Astro SSG
-   Application pages → Keep React SPA
-   Use subdomain or path-based routing
-   **Time: 80-100 hours**

---

## 9. Recommendations

### For Immediate Migration (Full Rewrite)

✅ **Choose this if:**

-   SEO is critical for all pages
-   Performance is a priority
-   You have 6-8 weeks available
-   Team has Astro experience or learning capacity

### For Gradual Migration

✅ **Choose this if:**

-   Can't afford downtime
-   Want to derisk the migration
-   Team needs to learn Astro incrementally
-   Budget/time constraints

### For Minimal Migration

✅ **Choose this if:**

-   Current app works well
-   Only need SEO improvements
-   Limited time/budget
-   Risk-averse

---

## 10. Next Steps

1. **Proof of Concept (Week 1):**

    - Set up Astro with React integration
    - Migrate one simple page (e.g., About)
    - Test DHIS2 authentication
    - Validate build/deployment

2. **Team Alignment (Week 1):**

    - Review this plan with team
    - Decide on migration approach
    - Allocate resources
    - Set milestones

3. **Kickoff (Week 2):**
    - Start Phase 1
    - Set up project infrastructure
    - Begin parallel work streams

---

## Appendix A: Key Dependencies to Add

```json
{
    "dependencies": {
        "astro": "^4.0.0",
        "@astrojs/react": "^3.0.0",
        "@astrojs/node": "^8.0.0",
        "@astrojs/sitemap": "^3.0.0",
        "nanostores": "^0.10.0",
        "@nanostores/react": "^0.7.0"
    }
}
```

## Appendix B: Astro Config Example

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    output: "hybrid", // SSG + SSR
    adapter: node({
        mode: "standalone",
    }),
    integrations: [react(), sitemap()],
    vite: {
        resolve: {
            alias: {
                "@": "/src",
            },
        },
    },
    server: {
        proxy: {
            "/dhis2": {
                target: process.env.DHIS2_BASE_URL,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/dhis2/, ""),
            },
        },
    },
});
```

---

## Appendix C: Clean Architecture Compatibility

**The existing Clean Architecture structure is highly compatible with Astro:**

✅ **Domain Layer:** No changes needed - pure TypeScript entities and interfaces

✅ **Data Layer:** Minor adaptations for server/client context awareness

✅ **Presentation Layer:** Replace React components with Astro components (where beneficial)

**Example adaptation:**

```typescript
// src/data/repositories/CountryD2Repository.ts
export class CountryD2Repository implements CountryRepository {
    constructor(private api: D2Api) {}

    // Works in both server (SSR) and client contexts
    async get(): Promise<FutureData<Country[]>> {
        return this.api.get<CountryData[]>("/api/countries").map(data => data.map(toCountryEntity));
    }
}
```

The composition root pattern fits perfectly with Astro's dependency injection approach.

---

## Document Version

-   **Version:** 1.0
-   **Date:** November 17, 2025
-   **Author:** GitHub Copilot
-   **Reviewed by:** [To be filled]
-   **Status:** Draft

---

## Change Log

| Date       | Version | Changes       | Author         |
| ---------- | ------- | ------------- | -------------- |
| 2025-11-17 | 1.0     | Initial draft | GitHub Copilot |
