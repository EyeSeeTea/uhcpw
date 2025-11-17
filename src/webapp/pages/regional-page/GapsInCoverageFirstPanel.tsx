import React, { useState } from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";

import i18n from "../../../locales";
import { Id } from "../../../domain/entities/Ref";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { colors } from "../app/themes/dhis2.theme";
import { FullScreenNotesDialog } from "../../components/dialog/FullScreenNotesDialog";
import { NotesDialog } from "../../components/dialog/NotesDialog";
import { VisualContent } from "./GapsInCoveragePanel";
import { Maybe } from "../../../types/utils";

type GapsInCoverageFirstPanelProps = {
    title?: string;
    regionId: Id;
    mainText?: string;
    progressText?: string;
    visual: Maybe<VisualContent>;
    showDialogInFullScreen?: boolean;
};

export const GapsInCoverageFirstPanel: React.FC<GapsInCoverageFirstPanelProps> = props => {
    const { title, mainText, progressText, visual, showDialogInFullScreen = false } = props;
    const [visualTextInfo, setVisualTextInfo] = useState<string | undefined>(undefined);

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Paragraph variant="body1" gutterBottom>
                    {children}
                </Paragraph>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
        }),
        []
    );

    return (
        <Container>
            <TextContainer>
                <StyledTitle variant="h6" gutterBottom>
                    {title}
                </StyledTitle>
            </TextContainer>

            {mainText && !visual ? (
                <TextContainer>
                    <ReactMarkdown components={markdownComponents}>{mainText}</ReactMarkdown>{" "}
                </TextContainer>
            ) : null}

            {visual ? (
                <ContentWrapper>
                    {mainText && (
                        <TextContainer>
                            <ReactMarkdown components={markdownComponents}>{mainText}</ReactMarkdown>
                        </TextContainer>
                    )}

                    {visual.visual ? (
                        <img
                            style={{ paddingBlockStart: "8px" }}
                            width="100%"
                            alt={i18n.t(visual.title || "Gaps in coverage chart")}
                            src={visual.visual}
                        />
                    ) : null}
                </ContentWrapper>
            ) : null}

            {visualTextInfo &&
                (showDialogInFullScreen ? (
                    <FullScreenNotesDialog
                        isOpen={!!visualTextInfo}
                        onClose={() => setVisualTextInfo(undefined)}
                        dialogInfo={visualTextInfo}
                    />
                ) : (
                    <NotesDialog
                        isOpen={!!visualTextInfo}
                        onClose={() => setVisualTextInfo(undefined)}
                        dialogInfo={visualTextInfo}
                    />
                ))}

            {progressText && (
                <TextContainer>
                    <ReactMarkdown components={markdownComponents}>{progressText}</ReactMarkdown>
                </TextContainer>
            )}
        </Container>
    );
};

const Container = styled.div`
    max-width: 100%;
    padding: 20px 50px 30px 50px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 30px;
        padding-inline-start: 0px;
    }
`;

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 50%) minmax(0, 50%);
    gap: 80px;
    width: 100%;
    align-items: stretch;
    > * {
        min-height: 0;
    }

    @media (max-width: 1280px) {
        grid-template-columns: 1fr;
        gap: 8px;
    }
`;

const Paragraph = styled(Typography)`
    font-family: Lato;
    margin-block: 10px;
    font-size: 1rem;
    color: ${colors.black};

    &:first-child {
        margin-block-start: 0;
    }

    &:last-child {
        margin-block-end: 0;
    }
`;

const StyledLi = styled.li`
    font-family: Lato;
    font-size: 1rem;
    line-height: 1.43;
    color: ${colors.black};
`;

const StyledUl = styled.ul`
    font-family: Lato;
    font-size: 1rem;
    padding-inline-start: 14px;
    color: ${colors.black};
    margin-inline-start: 0;
    margin-block-start: 0;
`;

const StyledTitle = styled(Typography)`
    margin-inline-end: 24px;
    color: ${colors.black};

    &.MuiTypography-h6 {
        font-weight: bold;
    }
`;

const TextContainer = styled.div`
    max-width: 600px;
`;
