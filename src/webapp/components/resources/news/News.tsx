import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { NewsItem } from "../../../pages/resources/landing/ResourcesState";
import { SeeAll } from "../../see-all/SeeAll";

export interface NewsProps {
    newsItems: NewsItem[];
}

export const News: React.FC<NewsProps> = React.memo(({ newsItems }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Row>
                    <Typography variant="h6">{i18n.t("News")}</Typography>
                    <SeeAll textColor="blue" onClick={() => {}} />
                </Row>
            </ItemsTitleContainer>

            <Grid container spacing={5}>
                {newsItems.map((item, index) => {
                    return (
                        <Grid key={index} item lg={4} md={6} xs={12}>
                            <Center>
                                <Item>
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        style={{ borderRadius: 10, marginBottom: 6 }}
                                    />
                                    <Typography variant="body2" gutterBottom>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2">{item.date}</Typography>
                                </Item>
                            </Center>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
});

const ItemsTitleContainer = styled.div`
    padding: 32px;
`;

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Item = styled.div`
    border-radius: 10px;
    padding: 16px;
    width: 450px;
    flex-direction: column;
`;
