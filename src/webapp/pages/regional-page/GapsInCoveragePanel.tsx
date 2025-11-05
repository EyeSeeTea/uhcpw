import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";
import InfoIcon from "@material-ui/icons/Info";

import i18n from "../../../locales";
import { Id } from "../../../domain/entities/Ref";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { colors } from "../app/themes/dhis2.theme";
import { FullScreenNotesDialog } from "../../components/dialog/FullScreenNotesDialog";
import { NotesDialog } from "../../components/dialog/NotesDialog";

type VisualContent = {
    visual?: string;
    title?: string;
    textAbove?: string;
    textBelow?: string;
    textInfo?: string;
};

type GapsInCoveragePanelProps = {
    title?: string;
    regionId: Id;
    mainText?: string;
    progressText?: string;
    visuals?: VisualContent[];
    showDialogInFullScreen?: boolean;
};

export const GapsInCoveragePanel: React.FC<GapsInCoveragePanelProps> = props => {
    const { regionId, title, mainText, progressText, visuals, showDialogInFullScreen = false } = props;
    const [visualTextInfo, setVisualTextInfo] = useState<string | undefined>(undefined);

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Text variant="body1" gutterBottom>
                    {children}
                </Text>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
        }),
        []
    );

    return (
        <Container>
            <StyledTitle variant="h6" gutterBottom>
                {title}
            </StyledTitle>

            {mainText && <ReactMarkdown components={markdownComponents}>{mainText}</ReactMarkdown>}

            {visuals?.map((visualContent, index) => (
                <React.Fragment key={`region-${regionId}-visual-content-${index}`}>
                    {visualContent.textAbove && (
                        <div style={{ marginTop: "12px" }}>
                            <ReactMarkdown components={markdownComponents}>{visualContent.textAbove}</ReactMarkdown>
                        </div>
                    )}

                    {visualContent.title && (
                        <ChartTitleRow>
                            <ChartTitle variant="h6" gutterBottom>
                                {visualContent.title}
                            </ChartTitle>

                            <StyledIconButton
                                onClick={() => setVisualTextInfo(visualContent?.textInfo)}
                                $color="#185698"
                                padding="4px"
                            >
                                <CustomInfoIconCountry color="primary" className="info-button" />
                            </StyledIconButton>
                        </ChartTitleRow>
                    )}

                    {visualContent.visual && (
                        <img
                            style={{ paddingBlockStart: "8px" }}
                            width="100%"
                            alt={i18n.t(visualContent.title || "Gaps in coverage chart")}
                            src={visualContent.visual}
                        />
                    )}

                    {visualContent.textBelow && (
                        <div style={{ marginTop: "12px" }}>
                            <ReactMarkdown components={markdownComponents}>{visualContent.textBelow}</ReactMarkdown>
                        </div>
                    )}
                </React.Fragment>
            ))}

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

            {progressText && <ReactMarkdown components={markdownComponents}>{progressText}</ReactMarkdown>}
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

const ChartTitleRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0px;
    align-items: flex-start;
    width: 100%;
    gap: 24px;
    align-items: center;
    justify-content: flex-start;
`;

const ChartTitle = styled(Typography)`
    font-family: Lato;
    margin-block-start: 20px;
    margin-block-end: 6px;
    font-size: 1rem;
    font-weight: bold;
    color: ${colors.black};
    white-space: "normal";
    width: 100%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-left: 15px;
    }
`;

const Text = styled(Typography)`
    font-family: Lato;
    margin-block: 6px;
    font-size: 1rem;
    color: ${colors.black};
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
    margin-inline-start: 14px;
    margin-block-start: 0;
`;

const StyledTitle = styled(Typography)`
    margin-inline-end: 24px;
    color: ${colors.black};

    &.MuiTypography-h6 {
        font-weight: bold;
    }
`;

const StyledIconButton = styled(IconButton)<{ $color: string; padding: string }>`
    padding: ${props => props.padding};
    color: ${props => props.$color};

    svg {
        font-size: 33px;
    }
`;

const CustomInfoIconCountry = styled(InfoIcon)`
    color: ${colors.darkBlue};
    font-size: 25px;
`;
