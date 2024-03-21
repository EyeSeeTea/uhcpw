import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
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

const Item: React.FC<{ resource: Resource; handleOnTagClick: (url: string) => void }> = React.memo(
    ({ resource, handleOnTagClick }) => {
        switch (resource.kind) {
            case "comparative-analysis":
                return (
                    <SimpleResourceItem
                        title={resource.title}
                        url={resource.links[0]?.url || ""}
                        image={resource.image}
                        date={resource.date}
                        tag={i18n.t("Comparative analysis")}
                        onTagClick={() => handleOnTagClick("/resources/comparative-analysis")}
                    />
                );
            case "country-analysis":
                return (
                    <SimpleResourceItem
                        title={resource.title}
                        url={resource.links[0]?.url || ""}
                        image={resource.image}
                        date={resource.date}
                        tag={i18n.t("Country analysis")}
                        onTagClick={() => handleOnTagClick("/resources/country-analysis")}
                    />
                );
            case "news":
                return (
                    <SimpleResourceItem
                        title={resource.title}
                        url={resource.url}
                        image={resource.image}
                        date={resource.date}
                        tag={i18n.t("News")}
                        onTagClick={() => handleOnTagClick("/resources/news")}
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
                        onTagClick={() => handleOnTagClick("/resources/multimedia")}
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
    padding: 48px;
`;
