import React from "react";
import styled from "styled-components";

import { PolicyExplorerCellEntitlements } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import i18n from "../../../locales";
import { FullCircleIcon, HalfCircleIcon } from "./TableCellIcons";

const COLOR = "#0460a7";
const LEGEND_COLOR = "#929293";

export function TableEntitlementsLegend() {
    return (
        <Container>
            <LegendContainer>
                <FullCircleIcon color={LEGEND_COLOR} /> <span>{i18n.t("Most undocumented migrants")}</span>
            </LegendContainer>
            <LegendContainer>
                <HalfCircleIcon color={LEGEND_COLOR} /> <span>{i18n.t("Some undocumented migrants")}</span>
            </LegendContainer>
        </Container>
    );
}

export const TableEntitlementsData = React.memo(({ cell }: { cell: PolicyExplorerCellEntitlements }) => {
    switch (cell.value) {
        case "most":
            return <FullCircleIcon color={COLOR} />;
        case "some":
            return <HalfCircleIcon color={COLOR} />;
        default:
            return <></>;
    }
});

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10%;
    margin-block: 16px;
`;

const LegendContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    span {
        margin-top: 3px;
        color: #000000;
    }
`;
