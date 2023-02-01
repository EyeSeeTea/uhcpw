import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";

const focusList = [
    i18n.t(
        "The financial hardship indicators available on UHC Watch are based on a capacity to pay approach, making them sensitive to equity"
    ),
];

const analysisList = [
    i18n.t("Data on financial hardship are complemented by data on unmet need for health and dental care"),
];

const storyList = [i18n.t("Analysis of gaps in coverage enables concrete recommendations for policy")];

export const Methods: React.FC = () => {
    return (
        <>
            <SectionHeader text={i18n.t("Methods")} />
            <Content container>
                <Focus item md={4} xs={12}>
                    <SectionBlock title={i18n.t("A focus on equity:")} textList={focusList} />
                </Focus>
                <Analysis item md={4} xs={12}>
                    <SectionBlock title={i18n.t("Unmet need must be part of the analysis:")} textList={analysisList} />
                </Analysis>
                <Story item md={4} xs={12}>
                    <SectionBlock title={i18n.t("No numbers without a story:")} textList={storyList} />
                </Story>
            </Content>
        </>
    );
};

const Content = styled(Grid)``;

const Focus = styled(Grid)`
    background: #4fac56;
    color: white;
`;

const Analysis = styled(Grid)`
    background: #fe8c4f;
    color: white;
`;

const Story = styled(Grid)`
    background: #0360a6;
    color: white;
`;
