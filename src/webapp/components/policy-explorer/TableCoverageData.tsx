import React from "react";
import styled from "styled-components";

import { PolicyExplorerCellCoverage } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import i18n from "../../../locales";
import { CircleXIcon, FullCircleIcon, HalfCircleIcon } from "./TableCellIcons";

const healthcareTypeToColor: Record<string, string> = {
    "Primary care visits": "#f6f000",
    "Outpatient specialist visits": "#ffc000",
    "Emergency care": "#c78f3d",
    "Outpatient medicines": "#c00000",
    "Medical products": "#ed7d31",
    "Diagnostics tests": "#7030a0",
    "Dental care visits": "#00b0f0",
    "Dental care treatment": "#0070c0",
    "Inpatient care": "#00b050",
    "Inpatient medicines": "#385724",
};

const LEGEND_COLOR = "#929293";

export function TableCoverageLegend() {
    return (
        <Container>
            <LegendContainer>
                <FullCircleIcon color={LEGEND_COLOR} /> <span>{i18n.t("User charges are applied")}</span>
            </LegendContainer>
            <LegendContainer>
                <HalfCircleIcon color={LEGEND_COLOR} /> <span>{i18n.t("Care not covered for most people")}</span>
            </LegendContainer>
            <LegendContainer>
                <CircleXIcon color={LEGEND_COLOR} /> <span>{i18n.t("Care not covered")}</span>
            </LegendContainer>
        </Container>
    );
}

export const TableCoverageData = React.memo(({ cell }: { cell: PolicyExplorerCellCoverage }) => {
    const color = healthcareTypeToColor[cell.columnName];
    switch (cell.value) {
        case "yes":
            return <FullCircleIcon color={color} />;
        case "varies":
            return <HalfCircleIcon color={color} />;
        case "notCovered":
            return <CircleXIcon color={color} />;
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
