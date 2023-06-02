import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import styled from "styled-components";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { SimpleResourceItem } from "../../resources/common/SimpleResourceItem";
import { ResourceState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { Grid } from "@material-ui/core";

export interface ResourcesProps {
    resources?: ResourceState[];
}

export const Resources: React.FC<ResourcesProps> = ({ resources }) => {
    return (
        <Content>
            <SectionHeader text={i18n.t("Resources")} />
            <Container>
                <Grid container spacing={5}>
                    {resources &&
                        resources.map((resource, index) => {
                            return (
                                <Grid key={index} item md={4} xs={12}>
                                    <Item resource={resource} />
                                </Grid>
                            );
                        })}
                </Grid>
            </Container>
        </Content>
    );
};

const Item: React.FC<{ resource: Resource }> = React.memo(({ resource }) => {
    switch (resource.kind) {
        case "comparative-analysis":
            return (
                <SimpleResourceItem
                    title={resource.text}
                    url={resource.links[0]?.url || ""}
                    image={resource.image}
                    date={new Date(resource.year)}
                    tag={i18n.t("Comparative analysis")}
                />
            );
        case "country-analysis":
            return (
                <SimpleResourceItem
                    title={resource.text}
                    url={resource.links[0]?.url || ""}
                    image={resource.image}
                    date={new Date(resource.year)}
                    tag={i18n.t("Country analysis")}
                />
            );
        case "news":
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.url}
                    image={resource.image}
                    date={resource.date}
                    dateFormat={"DD MMMM YYYY"}
                    tag={i18n.t("News")}
                />
            );
        case "multimedia": {
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.url}
                    image={resource.image}
                    date={resource.date}
                    tag={i18n.t("Multimedia")}
                />
            );
        }
    }
});

const Content = styled.div`
    background: white;
`;

const Container = styled.div`
    padding: 48px;
`;
