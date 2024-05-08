import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";
import { Divider } from "../common/Divider";
import bubblePatternWhite from "../../../assets/bubble-pattern-white.png";
import { MethodsContent } from "../../../../domain/entities/HomePageContent";

type MethodsProps = { content: MethodsContent };

export const Methods: React.FC<MethodsProps> = ({ content }) => {
    return (
        <>
            <SectionHeader
                header={content.title}
                subheader={content.subtitle}
                isBackgroundOnRight={false}
                url={content.buttonLink}
            />
            <Content container>
                <Focus item md={4} xs={12}>
                    <SectionBlock title={content.column1.title} text={content.column1.text} />
                </Focus>
                <Analysis item md={4} xs={12}>
                    <SectionBlock title={content.column2.title} text={content.column2.text} />
                </Analysis>
                <Story item md={4} xs={12}>
                    <SectionBlock title={content.column3.title} text={content.column3.text} />
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
