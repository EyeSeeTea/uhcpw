import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Container, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";

type Resource = {
    tag: string;
    title: string;
    date: string;
    image: string;
};

const resources: Resource[] = [
    {
        title: "Bulgaria",
        date: "2022",
        image: "https://picsum.photos/seed/example111/400/300",
        tag: "Country Analysis",
    },
    {
        title: "Can people afford to pay for health care? New evidence on financial protection in bulgaria",
        date: "2022",
        image: "https://picsum.photos/seed/example2/400/300",
        tag: "Country Profile",
    },
    {
        title: "Spending on health in Europe: entering a new era",
        date: "2021",
        image: "https://picsum.photos/seed/example33/400/300",
        tag: "Comparative Analysis",
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
];

export const Resources: React.FC = () => {
    return (
        <Content>
            <SectionHeader text={i18n.t("Resources")} />
            <Body maxWidth="lg">
                <Grid container spacing={5}>
                    {resources.map((resource, index) => {
                        return (
                            <Grid key={index} item md={4} xs={12}>
                                <ImageContainer>
                                    <Image src={resource.image} />
                                    <TitleContainer>
                                        <Typography variant="caption" display="block">
                                            {resource.title}
                                        </Typography>
                                        <Typography variant="caption">{resource.date}</Typography>
                                    </TitleContainer>
                                </ImageContainer>
                                <Tag>
                                    <Typography variant="body2">{resource.tag}</Typography>
                                </Tag>
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

const ImageContainer = styled.div`
    position: relative;
`;

const TitleContainer = styled.div`
    background: linear-gradient(to top, #4d90fe, rgba(255, 0, 0, 0));
    position: absolute;
    height: 40%;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.8;
    margin-bottom: 5px;
    color: white;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: end;
`;

const Image = styled.img`
    width: 100%;
    border-radius: 5px;
`;

const Tag = styled.div`
    border-radius: 20px;
    background: #efefef;
    color: #174587;
    padding: 8px 16px;
    margin-top: 8px;
    display: inline-block;
`;
