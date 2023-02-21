import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";

const countryContextList = [
    i18n.t(
        "Find out about the current situation, changes over time and what can be done to strengthen financial protection"
    ),
];

const regionList = [
    i18n.t("Compare health system performance, identify common gaps in coverage and explore good practice"),
];

export const Analysis: React.FC = () => {
    return (
        <>
            <SectionHeader text={i18n.t("Analysis")} />
            <Content container>
                <CountryContext item md={6} xs={12}>
                    <SectionBlock title={i18n.t("See a country in context")} textList={countryContextList} />
                </CountryContext>
                <Region item md={6} xs={12}>
                    <SectionBlock title={i18n.t("See the region at a glance")} textList={regionList} />
                </Region>
            </Content>
        </>
    );
};

const Content = styled(Grid)``;

const CountryContext = styled(Grid)`
    background: #0360a6;
    color: white;
`;

const Region = styled(Grid)`
    background: #4fac56;
    color: white;
`;
