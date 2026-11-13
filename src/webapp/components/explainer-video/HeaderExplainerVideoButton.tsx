import React from "react";
import styled from "styled-components";

import { Explainer } from "../../../domain/entities/explainers/Explainer";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { HEADER_MENU_TEXT_INSET_PX } from "../layout/pageMargins";
import { ExplainerVideoButton } from "./ExplainerVideoButton";

type HeaderExplainerVideoButtonProps = {
    explainer: Explainer;
};

/** Explainer video button for the country and region headers. It ends where the text of the menu buttons ends. */
export const HeaderExplainerVideoButton: React.FC<HeaderExplainerVideoButtonProps> = ({ explainer }) => (
    <AlignedWithMenuText>
        <ExplainerVideoButton explainer={explainer} />
    </AlignedWithMenuText>
);

const AlignedWithMenuText = styled.div`
    margin-inline-end: ${HEADER_MENU_TEXT_INSET_PX}px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline-end: 0;
    }
`;
