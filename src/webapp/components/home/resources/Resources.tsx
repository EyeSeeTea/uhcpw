import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Container, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";

type Resource = {
    tag: string;
    title: string;
    date: string;
    image: string;
};

const resources: Resource[] = [
    {
        title: "Can people afford to pay for health care? New evidence on financial protection in bulgaria",
        date: "2021",
        image: "https://picsum.photos/seed/example2/400/300",
        tag: "Country Profile",
    },
    {
        title: "Co-payment policy: considerations for Ukraine",
        date: "2022",
        image: "https://picsum.photos/seed/example111/400/300",
        tag: "Country Analysis",
    },
    {
        title: "Financial protection in Spain: a pilar of universal health coverage",
        date: "2021",
        image: "https://picsum.photos/seed/example5/400/300",
        tag: "Multimedia",
    },
    {
        title: "Countries in eastern Europe and central Asia work together to monitor finalcial protection",
        date: "2022",
        image: "https://picsum.photos/seed/example6/400/300",
        tag: "News",
    },
    {
        title: "Spending on health in Europe: entering a new era",
        date: "2021",
        image: "https://picsum.photos/seed/example33/400/300",
        tag: "Country analysis",
    },
    {
        title: "Universal health coverage: everyone, everywhere",
        date: "2019",
        image: "https://picsum.photos/seed/example6/400/300",
        tag: "Multimedia",
    },
];

export const Resources: React.FC = () => {
    return (
        <Content>
            <SectionHeader header={i18n.t("Resources")} hasArrowIcon />
            <Body maxWidth="lg">
                <Grid container spacing={4}>
                    {resources.map((resource, index) => {
                        return (
                            <Grid item key={index} xs={12} sm={6} md={6} lg={4}>
                                <Image src={resource.image} />
                                <Row>
                                    <Tag>
                                        <Typography variant="caption">{resource.tag}</Typography>
                                    </Tag>
                                    <Typography variant="body1">{resource.date}</Typography>
                                </Row>
                                <Typography variant="body1">{resource.title}</Typography>
                            </Grid>
                        );
                    })}
                </Grid>
            </Body>
        </Content>
    );
};

const Content = styled.div`
    background: white;
`;

const Body = styled(Container)`
    padding-bottom: 48px;
`;

const Image = styled.img`
    //width: 100%;
`;

const Tag = styled.div`
    border-radius: 20px;
    background: #efefef;
    background-color: ${colors.accentPrimaryDark};
    color: white;
    padding: 4px 16px;
    margin-top: 8px;
    display: inline-block;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 20px;
    margin-bottom: 15px;
`;
