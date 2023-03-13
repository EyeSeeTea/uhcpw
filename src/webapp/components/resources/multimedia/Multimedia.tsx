import { Box, Card, Grid, Typography } from "@material-ui/core";
import { Divider } from "material-ui";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { MultimediaItem } from "../../../pages/resources/ResourcesState";
import { SeeAll } from "../../see-all/SeeAll";

export interface MultimediaProps {
    multimediaItems: MultimediaItem[];
}

export const Multimedia: React.FC<MultimediaProps> = React.memo(({ multimediaItems }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Row>
                    <Typography variant="h6" color="textSecondary">
                        {i18n.t("Multimedia")}
                    </Typography>
                    <SeeAll textColor="white" onClick={() => {}} />
                </Row>
            </ItemsTitleContainer>

            <Grid container spacing={5}>
                {multimediaItems.map((item, index) => {
                    return (
                        <Grid key={index} item lg={4} md={6} xs={12}>
                            <Center>
                                <Item>
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        style={{ borderRadius: 10, marginBottom: 6 }}
                                    />
                                    <Typography variant="body2" gutterBottom color="textSecondary">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.date}
                                    </Typography>
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
