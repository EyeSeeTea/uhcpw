import React, { useMemo } from "react";
import { ResourceState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { ComparativeAnalysisItem } from "../comparative-analysis/ComparativeAnalysisItem";
import { CountryAnalysisItem } from "../country-analysis/CountryAnalysisItem";
import { SimpleResourceItem } from "./SimpleResourceItem";
import { MultimediaResourceItem } from "./MultimediaResourceItem";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import styled from "styled-components";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";

const themeColor: Readonly<Record<string, string>> = {
    "Financial Protection": "#008ad7",
    Resilience: "#4fad56",
    "Spending on Health": "#0360a7",
    "Voluntary Health Insurance": "#ff8d4e",
};

export const ResourceItem: React.FC<{ resource: ResourceState; analyticsPageTitle: string; normalize?: boolean }> =
    React.memo(props => {
        const { resource, analyticsPageTitle } = props;
        const { redirectWithEvent } = useAnalytics();

        const themeTags = useMemo(
            () =>
                resource.kind === "multimedia"
                    ? resource.resourceThemes.map(theme => ({ name: theme.name, color: themeColor[theme.code] }))
                    : [],
            [resource]
        );

        const redirectToNews = useMemo(
            () =>
                redirectWithEvent({
                    name: "resource",
                    pageTitle: analyticsPageTitle,
                    year: resource.date.getFullYear(),
                    resourceName: resource.title,
                    category: resource.kind,
                }),
            [resource, redirectWithEvent, analyticsPageTitle]
        );

        switch (resource.kind) {
            case "comparative-analysis":
                return <ComparativeAnalysisItem comparativeAnalysis={resource} {...props} />;
            case "country-analysis":
                return <CountryAnalysisItem countryAnalysis={resource} analyticsPageTitle={analyticsPageTitle} />;
            case "news":
                return (
                    <SimpleResourceItemContainer>
                        <SimpleResourceItem
                            title={resource.title}
                            url={resource.url}
                            image={resource.imageOriginal}
                            fallbackImage={resource.imageOriginal}
                            date={resource.date}
                            redirectWithEvent={redirectToNews}
                            dateFormat={"DD MMMM YYYY"}
                        />
                    </SimpleResourceItemContainer>
                );
            case "multimedia": {
                return (
                    <SimpleResourceItemContainer>
                        <MultimediaResourceItem
                            resource={resource}
                            analyticsPageTitle={analyticsPageTitle}
                            tags={themeTags}
                        />
                    </SimpleResourceItemContainer>
                );
            }
        }
    });

const SimpleResourceItemContainer = styled.div`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        height: 100%;
        width: 100%;
        max-width: 500px;
        padding: 0;
        justify-self: center;
        place-items: center;
        height: 100%;
    }
`;
