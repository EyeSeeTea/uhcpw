import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import styled from "styled-components";
import { SimpleResourceItem } from "../../resources/common/SimpleResourceItem";
import { MultimediaResourceItem } from "../../resources/common/MultimediaResourceItem";
import { useCategoryTags } from "../../resources/common/useCategoryTags";
import { ResourceState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { Grid } from "@material-ui/core";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

export interface ResourcesProps {
    resources?: ResourceState[];
}

export const Resources: React.FC<ResourcesProps> = ({ resources }) => {
    const history = useHistory();

    const handleOnTagClick = useCallback(
        url => {
            history.push(url);
        },
        [history]
    );

    return (
        <Content>
            <SectionHeader header={i18n.t("Resources")} />
            <Container>
                <Grid container spacing={5}>
                    {resources &&
                        resources.map((resource, index) => {
                            return (
                                <Grid key={index} item md={4} xs={12}>
                                    <Item resource={resource} handleOnTagClick={handleOnTagClick} />
                                </Grid>
                            );
                        })}
                </Grid>
            </Container>
        </Content>
    );
};

const Item: React.FC<{ resource: ResourceState; handleOnTagClick: (url: string) => void }> = React.memo(
    ({ resource, handleOnTagClick }) => {
        const { redirectWithEvent } = useAnalytics();

        const analyticsEvent = useMemo(() => {
            const common = {
                name: "resource" as const,
                pageTitle: "Homepage",
                year: resource.date.getFullYear(),
                resourceName: resource.title,
                category: resource.kind,
            };

            switch (resource.kind) {
                case "comparative-analysis":
                    return redirectWithEvent({
                        ...common,
                        theme: resource.themeName,
                        language: resource.links[0]?.language,
                    });
                case "country-analysis":
                    return redirectWithEvent({
                        ...common,
                        theme: resource.themeName,
                        country: resource.countryName,
                        language: resource.links[0]?.language,
                    });
                case "news":
                    return redirectWithEvent(common);
                case "multimedia":
                    return () => {};
            }
        }, [redirectWithEvent, resource]);

        const categoryTags = useCategoryTags(resource.kind, handleOnTagClick);

        switch (resource.kind) {
            case "comparative-analysis":
                return (
                    <SimpleResourceItem
                        title={resource.title}
                        url={resource.links[0]?.url || ""}
                        image={resource.imageOriginal}
                        fallbackImage={resource.imageOriginal}
                        date={resource.date}
                        redirectWithEvent={analyticsEvent}
                        tags={categoryTags}
                        maintainAspectRatio
                    />
                );
            case "country-analysis":
                return (
                    <SimpleResourceItem
                        title={resource.title}
                        url={resource.links[0]?.url || ""}
                        image={resource.imageOriginal}
                        fallbackImage={resource.imageOriginal}
                        date={resource.date}
                        redirectWithEvent={analyticsEvent}
                        tags={categoryTags}
                        maintainAspectRatio
                    />
                );
            case "news":
                return (
                    <SimpleResourceItem
                        title={resource.title}
                        url={resource.url}
                        image={resource.imageOriginal}
                        fallbackImage={resource.imageOriginal}
                        date={resource.date}
                        redirectWithEvent={analyticsEvent}
                        tags={categoryTags}
                        maintainAspectRatio
                    />
                );
            case "multimedia": {
                return (
                    <MultimediaResourceItem
                        resource={resource}
                        analyticsPageTitle="Homepage"
                        tags={categoryTags}
                        maintainAspectRatio
                    />
                );
            }
        }
    }
);

const Content = styled.div`
    background: white;
`;

const Container = styled.div`
    padding: 0 48px 48px 48px;
`;
