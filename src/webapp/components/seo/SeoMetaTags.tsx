import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSeoConfigForRoute, SeoConfig } from "../../../domain/entities/SeoConfig";

interface SeoMetaTagsProps {
    /**
     * Override SEO config for this specific page.
     * If not provided, will use default route-based configuration.
     */
    config?: Partial<SeoConfig>;
}

export const SeoMetaTags: React.FC<SeoMetaTagsProps> = ({ config: overrideConfig }) => {
    const location = useLocation();
    const routeConfig = getSeoConfigForRoute(location.pathname);
    const finalConfig: SeoConfig = { ...routeConfig, ...overrideConfig };

    const { title, description, image } = finalConfig;

    const fullUrl = window.location.href;
    const baseUrl = window.location.origin;
    const fullImageUrl = image ? (image?.startsWith("http") ? image : `${baseUrl}${image}`) : null;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {fullImageUrl && <meta property="og:image" content={fullImageUrl} />}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            {fullImageUrl && <meta property="twitter:image" content={fullImageUrl} />}
            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};
