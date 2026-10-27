import { Typography } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";
import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import mapBackground from "../../assets/map-background.jpg";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { ExplainerVideoButton } from "../explainer-video/ExplainerVideoButton";
import { useExplainer } from "../explainer-video/useExplainer";

type ExplorerTitleProps = {
    title: string;
    image: string;
    imageAlt: string;
    page: ExplainerPage;
};

export const ExplorerTitle: React.FC<ExplorerTitleProps> = React.memo(({ title, image, imageAlt, page }) => {
    const explainer = useExplainer(page);
    const hasExplainer = explainer !== undefined;

    return (
        <TitleContainer $hasExplainer={hasExplainer}>
            <Typography variant="h3">{title}</Typography>
            <Image src={image} alt={imageAlt} />
            {explainer && <ExplainerVideoButton explainer={explainer} smallScreenVariant="light" />}
        </TitleContainer>
    );
});

type ExplainerProps = { $hasExplainer: boolean };

const TitleContainer = styled.div<ExplainerProps>`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 24px 64px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px 32px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${props => props.color} url(${mapBackground});
        background-position: center;
        /* NOTICE: on small screens, without an explainer video the title keeps its layout from before the button */
        ${props =>
            props.$hasExplainer
                ? css`
                      > h3 {
                          flex-basis: 100%;
                      }
                  `
                : css`
                      padding-inline-end: 200px;
                      flex-wrap: nowrap;
                      gap: 0;
                  `}
    }
`;

const Image = styled.img`
    height: 56px;
    margin-inline-start: auto;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        order: 1;
    }
`;
