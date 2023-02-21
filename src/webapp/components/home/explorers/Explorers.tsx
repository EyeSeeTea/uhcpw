import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";

const indicatorExplorerList = [
    i18n.t("Impovershing out-of-pocket payments"),
    i18n.t("Catastrophic out-of-pocket payments"),
    i18n.t("Unmet need for health and dental care"),
    i18n.t("Spending on health"),
];

const policyExplorerList = [
    i18n.t("Population coverage"),
    i18n.t("Service coverage"),
    i18n.t("User Charges (co-payments)"),
    i18n.t("Voluntary health insurance"),
    i18n.t("Administrative barries"),
    i18n.t("Gasp in coverage"),
];

export const Explorers: React.FC = () => {
    return (
        <>
            <SectionHeader text={i18n.t("Explorers")} />
            <Content container>
                <IndicatorExplorer item md={6} xs={12}>
                    <SectionBlock title={i18n.t("Indicator Explorer")} textList={indicatorExplorerList} />
                </IndicatorExplorer>
                <PolicyExplorer item md={6} xs={12}>
                    <SectionBlock title={i18n.t("Policy Explorer")} textList={policyExplorerList} />
                </PolicyExplorer>
            </Content>
        </>
    );
};

const Content = styled(Grid)``;

const IndicatorExplorer = styled(Grid)`
    background: #fe8c4f;
    color: white;
`;

const PolicyExplorer = styled(Grid)`
    background: #0089d6;
    color: white;
`;
