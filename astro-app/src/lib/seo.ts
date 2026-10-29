import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";

/** Resolves SEO metadata for the current Astro route and deployment base. */
export const getSeoConfigForAstroRoute = (pathname: string) =>
    getSeoConfigForRoute(pathname, import.meta.env.BASE_URL);
