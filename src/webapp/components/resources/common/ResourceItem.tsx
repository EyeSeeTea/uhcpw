import React, { useMemo } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { ResourceState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { ComparativeAnalysisItem } from "../comparative-analysis/ComparativeAnalysisItem";
import { CountryAnalysisItem } from "../country-analysis/CountryAnalysisItem";
import { SimpleResourceItem } from "./SimpleResourceItem";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import styled from "styled-components";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";

export const ResourceItem: React.FC<{ resource: ResourceState; analyticsPageTitle: string }> = React.memo(props => {
    const { resource, analyticsPageTitle } = props;
    const { themes } = useAppContext();
    const { redirectWithEvent } = useAnalytics();

    const themeColor: Record<string, string> = {
        "Financial Protection": "#008ad7",
        Resilience: "#4fad56",
        "Spending on Health": "#0360a7",
        "Voluntary Health Insurance": "#ff8d4e",
    };

    const analyticsEvent = useMemo(() => {
        switch (resource.kind) {
            case "news":
                return redirectWithEvent({
                    name: "resource",
                    pageTitle: analyticsPageTitle,
                    year: resource.date.getFullYear(),
                    resourceName: resource.title,
                    category: resource.kind,
                });
            case "multimedia":
                return redirectWithEvent({
                    name: "resource",
                    pageTitle: analyticsPageTitle,
                    year: resource.date.getFullYear(),
                    resourceName: resource.title,
                    category: resource.kind,
                    theme: resource.themeName,
                });
            default:
                return () => {};
        }
    }, [resource, redirectWithEvent, analyticsPageTitle]);

    switch (resource.kind) {
        case "comparative-analysis":
            return <ComparativeAnalysisItem comparativeAnalysis={resource} analyticsPageTitle={analyticsPageTitle} />;
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
                        redirectWithEvent={analyticsEvent}
                        dateFormat={"DD MMMM YYYY"}
                    />
                </SimpleResourceItemContainer>
            );
        case "multimedia": {
            const theme = themes.find(theme => theme.code === resource.theme)?.name;
            return (
                <SimpleResourceItemContainer>
                    <SimpleResourceItem
                        title={resource.title}
                        url={resource.url}
                        image={resource.imageOriginal}
                        fallbackImage={resource.imageOriginal}
                        date={resource.date}
                        tag={theme}
                        tagColor={themeColor[resource.theme]}
                        redirectWithEvent={analyticsEvent}
                    />
                </SimpleResourceItemContainer>
            );
        }
    }
});

const SimpleResourceItemContainer = styled.div`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline: 32px;
    }
`;
