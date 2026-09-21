import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import _ from "lodash";

import i18n from "../../../locales";
import { PolicyExplorerSelectCategoryInfo } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { InfoBoxContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";

type EmptyContentInfo = PolicyExplorerSelectCategoryInfo | InfoBoxContent;

type EmptyContentProps = { infos: ReadonlyArray<EmptyContentInfo | undefined> };

export const EmptyContent: React.FC<EmptyContentProps> = React.memo(({ infos }) => {
    const availableInfos = _.compact(infos);

    if (availableInfos.length === 0) return null;

    return (
        <Container>
            {availableInfos.map(info => (
                <InfoBox key={info.title} info={info} />
            ))}
        </Container>
    );
});

const InfoBox: React.FC<{ info: EmptyContentInfo }> = React.memo(({ info }) => (
    <Content>
        <Row>
            <TextWrapper>
                <Title variant="h5">{i18n.t(info.title)}</Title>
                <ReactMarkdown
                    components={{
                        p: ({ children }) => <StyledParagraph variant="body1">{children}</StyledParagraph>,
                    }}
                >
                    {info.text}
                </ReactMarkdown>
            </TextWrapper>
        </Row>
    </Content>
));

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    gap: 32px;
    margin-top: 50px;
    margin-bottom: 50px;
    @media (max-width: 600px) {
        margin-top: 25px;
    }
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }
`;

const Content = styled.div`
    border-radius: 10px;
    background: #cce8f7;
    padding: 48px 32px;
    MuiSvgIcon-fontSizeLarge {
        font-size: 10rem;
    }
    &:not(:only-child) {
        flex: 1 1 0;
    }
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        &:not(:only-child) {
            flex: 0 1 auto;
            align-self: stretch;
        }
    }
`;

const TextWrapper = styled.div`
    max-width: 50vw;
`;

const Title = styled(Typography)`
    color: #008ad7;
    margin-block-end: 16px;
`;

const StyledParagraph = styled(Typography)`
    margin-block-end: 20px;
    &:last-child {
        margin-block-end: 0;
    }
`;
