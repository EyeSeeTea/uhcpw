import { appConfig } from "./app-config";

declare let __webpack_public_path__: string;

const basePath = appConfig.basePath === "/" ? "/" : `${appConfig.basePath.replace(/\/+$/, "")}/`;

// Webpack uses this value to resolve emitted assets and lazy chunks.
// It must be set before any asset-importing modules are evaluated.

// eslint-disable-next-line prefer-const
__webpack_public_path__ = basePath;
