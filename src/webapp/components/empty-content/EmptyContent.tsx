import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import _ from "lodash";

import i18n from "../../../locales";
import { InfoBoxContent } from "../../../domain/entities/InfoBoxContent";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";

type EmptyContentProps = { infos: ReadonlyArray<InfoBoxContent | undefined> };

export const EmptyContent: React.FC<EmptyContentProps> = React.memo(({ infos }) => {
    const availableInfos = _.compact(infos);

    if (availableInfos.length === 0) return null;

    return (
        <Container>
            {availableInfos.map((info, index) => (
                <InfoBox key={index} info={info} />
            ))}
        </Container>
    );
});

const InfoBox: React.FC<{ info: InfoBoxContent }> = React.memo(({ info }) => (
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
    padding: 32px;
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
