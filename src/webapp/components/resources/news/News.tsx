import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { NewsItem } from "../../../pages/resources/landing/ResourcesState";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";

export interface NewsProps {
    newsItems: NewsItem[];
}

export const News: React.FC<NewsProps> = React.memo(({ newsItems }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Row>
                    <Typography variant="h4">{i18n.t("News")}</Typography>
                    <ChevronRightIcon />
                </Row>
            </ItemsTitleContainer>

            <Item>
                <Image src={newsItems[0]?.img} alt={newsItems[0]?.title} />
                <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    {newsItems[0]?.date}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {newsItems[0]?.title}
                </Typography>
            </Item>
        </>
    );
});

const ItemsTitleContainer = styled.div`
    padding: 32px;
`;

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Item = styled.div`
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
`;

const Image = styled.img`
    width: 100%;
    height: 235px;
    margin-bottom: 12px;
    object-fit: cover;
`;
