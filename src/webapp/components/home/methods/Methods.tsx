import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";
import { Divider } from "../common/Divider";
import bubblePatternWhite from "../../../assets/bubble-pattern-white.png";

export const Methods: React.FC = () => {
    return (
        <>
            <SectionHeader
                header={i18n.t("Methods")}
                subheader={i18n.t("How financial protection is monitored matters")}
                isBackgroundOnRight={false}
                hasArrowIcon
            />
            <Content container>
                <Focus item md={4} xs={12}>
                    <SectionBlock
                        title={i18n.t("A focus on equity")}
                        text={i18n.t(
                            "We measure financial hardship using an approach that accounts for people's capacity to pay for health care"
                        )}
                    />
                </Focus>
                <Analysis item md={4} xs={12}>
                    <SectionBlock
                        title={i18n.t("Numbers and stories")}
                        text={i18n.t(
                            "UHC Watch identifies the factors that influence financial protection at country level, drawing on insights from comparative analysis"
                        )}
                    />
                </Analysis>
                <Story item md={4} xs={12}>
                    <SectionBlock
                        title={i18n.t("Actionable evidence")}
                        text={i18n.t(
                            "UHC Watch provides clear guidance for policy by identifying who lacks financial protection, driven by which health services and why"
                        )}
                    />
                </Story>
            </Content>
            <Divider />
        </>
    );
};

const Content = styled(Grid)``;

const Focus = styled(Grid)`
    background: linear-gradient(90deg, rgba(79, 172, 86, 1) 0%, rgba(161, 238, 167, 1) 100%);
    color: white;
    padding: 65px 55px;
`;

const Analysis = styled(Grid)`
    background: #fe8c4f url(${bubblePatternWhite}) no-repeat -400px -170px;
    color: white;
    padding: 65px 55px;
`;

const Story = styled(Grid)`
    background: #0360a6 url(${bubblePatternWhite}) no-repeat -400px -170px;
    color: white;
    padding: 65px 55px;
`;
