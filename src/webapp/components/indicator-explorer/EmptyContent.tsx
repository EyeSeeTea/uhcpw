import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import GridOnIcon from "@material-ui/icons/GridOn";

import i18n from "../../../locales";
import { IndicatorExplorerSelectCategoryInfo } from "../../../domain/entities/indicator-explorer/IndicatorExplorer";

export const EmptyContent: React.FC<{ info?: IndicatorExplorerSelectCategoryInfo }> = React.memo(({ info }) => {
    if (!info) return null;

    return (
        <Container>
            <Content>
                <Row>
                    <div>
                        <Title variant="h5">{i18n.t(info.title)}</Title>
                        <ReactMarkdown>{info.text}</ReactMarkdown>
                    </div>
                    <GridOnIcon htmlColor="white" fontSize="large" />
                </Row>
            </Content>
        </Container>
    );
});

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    margin-bottom: 50px;
`;

const Content = styled.div`
    border-radius: 10px;
    background: #cce8f7;
    max-width: 550px;
    padding: 48px 32px;
    MuiSvgIcon-fontSizeLarge {
        font-size: 10rem;
    }
`;

const Title = styled(Typography)`
    color: #008ad7;
`;
