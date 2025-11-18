import React from "react";
import CircleIcon from "@material-ui/icons/Brightness1";
import { SvgIcon } from "material-ui";
import styled from "styled-components";

import { PolicyExplorerCellCoverage } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import i18n from "../../../locales";

const DEFAULT_COLOR = "#555";
const healthcareTypeToColor: Record<string, string> = {
    "Primary care visits": "#f6f000",
    "Outpatient specialist visits": "#ffc000",
    "Emergency care": "#c78f3d",
    "Outpatient prescribed medicines": "#c00000",
    "Medical products": "#ed7d31",
    "Diagnostics tests": "#7030a0",
    "Dental care visits": "#00b0f0",
    "Dental care treatment": "#0070c0",
    "Inpatient care": "#00b050",
    "Inpatient medicines": "#385724",
};

export function TableCoverageLegend() {
    return (
        <Container>
            <LegendContainer>
                <FullCircleIcon /> <span>{i18n.t("User charges are applied")}</span>
            </LegendContainer>
            <LegendContainer>
                <HalfCircleIcon /> <span>{i18n.t("Care not covered for most people")}</span>
            </LegendContainer>
            <LegendContainer>
                <CircleXIcon /> <span>{i18n.t("Care not covered")}</span>
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

function FullCircleIcon({ color = DEFAULT_COLOR }: { color?: string }) {
    return <CircleIcon htmlColor={color} />;
}

function HalfCircleIcon({ color = DEFAULT_COLOR }: { color?: string }) {
    return (
        <SvgIcon viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20V2z" fill={color} />
            <path d="M12 2v20a10 10 0 000-20z" fill="none" stroke={color} />
        </SvgIcon>
    );
}

function CircleXIcon({ color = DEFAULT_COLOR }: { color?: string }) {
    return (
        <SvgIcon viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill={color} />
            <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </SvgIcon>
    );
}

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
    }
`;
