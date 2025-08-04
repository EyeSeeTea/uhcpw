import React from "react";
import { Grid } from "@material-ui/core";
import styled from "styled-components";

import { ResourceGroup } from "../../../components/resources/resource-group/ResourceGroup";
import { ResourceItem } from "../../../components/resources/common/ResourceItem";
import { ResourcesListBySectionState } from "./ResourcesState";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";
import { ScrollToTopButton } from "../../../components/scroll-to-top-button/ScrollToTopButton";
import { GridSize } from "@material-ui/core/Grid/Grid";

export const ResourcesListBySection: React.FC<{
    resourcesBySection: ResourcesListBySectionState[];
    themeSelected?: string;
    isSmallScreen?: boolean;
    hasSearchTerm?: boolean;
}> = React.memo(({ resourcesBySection, themeSelected, isSmallScreen, hasSearchTerm }) => (
    <Container>
        {isSmallScreen && <ScrollToTopButton />}
        {resourcesBySection.map((section, index) => (
            <Grid item md={12} xs={12} key={`section-${index}`}>
                {section.resources.length > 0 && (
                    <ResourceGroup
                        title={section.title}
                        seeAllUrl={`${section.seeAllUrl}${themeSelected ? `?theme=${themeSelected}` : ""}`}
                    >
                        {section.resources.map(resource => (
                            <StyledGrid key={resource.id} item {...getSectionGridSize(section.kind)}>
                                <ResourceItem
                                    resource={resource}
                                    analyticsPageTitle="Resources"
                                    normalize={hasSearchTerm}
                                />
                            </StyledGrid>
                        ))}
                    </ResourceGroup>
                )}
            </Grid>
        ))}
    </Container>
));

function getSectionGridSize(kind: ResourcesListBySectionState["kind"]): {
    lg: GridSize;
    md: GridSize;
    sm?: GridSize;
    xs: GridSize;
} {
    switch (kind) {
        case "news":
        case "multimedia":
            return { lg: 4, md: 6, xs: 12 };
        default:
            return { lg: 2, md: 3, sm: 6, xs: 12 };
    }
}

const Container = styled(Grid)`
    padding-block-end: 32px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline: 0;
        position: relative;
        padding-block-end: 0;
    }
`;

const StyledGrid = styled(Grid)`
    padding: 20px;
`;
