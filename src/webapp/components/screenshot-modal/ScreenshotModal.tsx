import React, { useCallback, useRef } from "react";
import { Box, Button, IconButton, Modal, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";
import _ from "lodash";
import styled from "styled-components";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";
import i18n from "../../../locales";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { Maybe } from "../../../types/utils";
import CloseIcon from "@material-ui/icons/Close";
import { Rotate } from "../rotate/Rotate";

interface ScreenshotModalProps {
    open?: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    backgroundColor?: string;
    exclusionClasses?: string[];
    hideTitle?: boolean;
    isSquareChart?: boolean;
    analyticsPageTitle: string;
    analyticsContent: {
        contentGroup: string;
        contentId: Maybe<string>;
    };
    forceRotation?: boolean;
}

function ScreenshotModal({
    open = false,
    onClose,
    title,
    backgroundColor = "#FFF",
    exclusionClasses,
    children,
    hideTitle = true,
    isSquareChart = false,
    analyticsPageTitle,
    analyticsContent,
    forceRotation = false,
}: ScreenshotModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { sendEvent } = useAnalytics();

    const handleDownload = useCallback(() => {
        if (ref.current) {
            downloadHtmlElement(ref.current, title.replace(".", "_"), { backgroundColor, exclusionClasses });
            sendEvent({
                name: "file_download",
                pageTitle: analyticsPageTitle,
                contentType: "image",
                contentGroup: analyticsContent.contentGroup,
                contentId: analyticsContent.contentId,
            });
        }
    }, [
        analyticsContent.contentGroup,
        analyticsContent.contentId,
        analyticsPageTitle,
        backgroundColor,
        exclusionClasses,
        sendEvent,
        title,
    ]);

    return (
        <StyledModal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Rotate enableRotation={forceRotation}>
                <StyledBox
                    backgroundColor={backgroundColor}
                    $isSquareChart={isSquareChart}
                    forceRotation={forceRotation}
                >
                    <Header>
                        {!hideTitle && <Title>{_.capitalize(title)}</Title>}
                        <StyledScreenshotButton
                            variant="contained"
                            endIcon={<ImageRoundedIcon />}
                            color="primary"
                            onClick={handleDownload}
                        >
                            <Typography>{i18n.t("Download")}</Typography>
                        </StyledScreenshotButton>
                        {
                            <CloseIconButton onClick={onClose}>
                                <StyledCloseIcon />
                            </CloseIconButton>
                        }
                    </Header>
                    <Content ref={ref}>
                        <ScreenshotContainer className="screenshot-container">{children}</ScreenshotContainer>
                    </Content>
                </StyledBox>
            </Rotate>
        </StyledModal>
    );
}

export default ScreenshotModal;

const StyledBox = styled(Box)<{ backgroundColor: string; $isSquareChart?: boolean; forceRotation: boolean }>`
    position: ${props => (!props?.forceRotation ? "absolute" : undefined)};
    left: 5%;
    top: ${props => (props?.$isSquareChart ? "1%" : "5%")};
    width: ${props => (!props?.forceRotation ? "90vw" : "100%")};
    background-color: ${props => props?.backgroundColor ?? "#FFFFFF"};
    border-radius: ${props => (!props?.forceRotation ? "10px" : "0px")};
`;

const StyledModal = styled(Modal)`
    overflow-y: auto;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    color: #343434;
    margin: 0;
`;

const StyledScreenshotButton = styled(Button)`
    border-radius: 20px;
    padding: 0px 32px;
    height: 42px;
    background: #185698;
    text-transform: initial;
    color: white;
    display: flex;
    gap: 5px;
    flex-wrap: nowrap;
    font-size: 26px;
`;

const Content = styled.div`
    width: calc(100% - 5px);
    height: calc(100% - 65px);
    margin-top: 2px;
    margin-left: 2px;
`;

const ScreenshotContainer = styled.div`
    position: relative;
    * {
        pointer-events: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .VisualizationPlugin-container {
        width: calc(100% - 50px);
    }
`;

const Header = styled.div`
    box-shadow: 0px 2px 0px #00000029;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: white;
    margin: 3px 3px 0 3px;
`;

const CloseIconButton = styled(IconButton)`
    position: absolute;
    right: 10px;
    top: 10px;
`;

const StyledCloseIcon = styled(CloseIcon)`
    color: white;
    background-color: #035fa7;
    border-radius: 50%;
    padding: 4px;
    font-size: 12px;
`;
