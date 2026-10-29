import { appConfig } from "./app-config";

/**
 * CRA builds with `homepage: "."`, so imported assets get relative URLs that break on nested routes
 * (e.g. /resources/multimedia). Resolve them from the base path detected at runtime instead.
 */
declare global {
    // `var` is required to declare a global; webpack replaces this free variable at build time.
    // eslint-disable-next-line no-var
    var __webpack_public_path__: string;
}

__webpack_public_path__ = appConfig.basePath.endsWith("/") ? appConfig.basePath : `${appConfig.basePath}/`;
