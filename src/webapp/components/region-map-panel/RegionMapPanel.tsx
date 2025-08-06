import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import weakIcon from "../../assets/map/icon-weak.svg";
import strongIcon from "../../assets/map/icon-strong.svg";
import gapsIcon from "../../assets/map/icon-normal.svg";
import { RegionMainMapPanelContent } from "../../../domain/entities/region/RegionInfo";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import i18n from "../../../locales";

type RegionMapPanelProps = {
    mainPanelContent?: RegionMainMapPanelContent;
};

export const RegionMapPanel: React.FC<RegionMapPanelProps> = props => {
    const { mainPanelContent } = props;

    return (
        <Container>
            {mainPanelContent?.title && (
                <Typography variant="h2" style={{ fontWeight: 400 }} gutterBottom>
                    {mainPanelContent?.title}
                </Typography>
            )}

            {mainPanelContent?.description && (
                <ParagraphContainer>
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <Typography paragraph>{children}</Typography>,
                        }}
                    >
                        {mainPanelContent?.description}
                    </ReactMarkdown>
                </ParagraphContainer>
            )}

            <UmbrellaItemsContainer>
                <UmbrellaItem>
                    <Marker src={weakIcon} />
                    {i18n.t("Weaker financial protection")}
                </UmbrellaItem>

                <UmbrellaItem>
                    <Marker src={gapsIcon} />
                </UmbrellaItem>

                <UmbrellaItem>
                    <Marker src={strongIcon} />
                    <span>{i18n.t("Stronger financial protection")}</span>
                </UmbrellaItem>
            </UmbrellaItemsContainer>
        </Container>
    );
};

const Container = styled.div`
    overflow-y: auto;
    font-size: 16px;
    padding: 16px;
`;

const ParagraphContainer = styled.div`
    max-width: 46ch;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        max-width: 100%;
    }
`;

const UmbrellaItemsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-block: 48px 35px;
`;

const UmbrellaItem = styled.div`
    max-width: 150px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
`;

const Marker = styled.img`
    background-size: cover;
    width: 80px;
    margin-bottom: 16px;
`;
