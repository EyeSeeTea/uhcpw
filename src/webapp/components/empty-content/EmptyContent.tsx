import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import i18n from "../../../locales";
import { PolicyExplorerSelectCategoryInfo } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { SelectCategoryContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";

export const EmptyContent: React.FC<{ info?: PolicyExplorerSelectCategoryInfo | SelectCategoryContent }> = React.memo(
    ({ info }) => {
        if (!info) return null;

        return (
            <Container>
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
            </Container>
        );
    }
);

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    margin-bottom: 50px;
`;

const Content = styled.div`
    border-radius: 10px;
    background: #cce8f7;
    padding: 48px 32px;
    MuiSvgIcon-fontSizeLarge {
        font-size: 10rem;
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
