import React, { useCallback, useRef } from "react";
import { Box, Button, Modal, Typography } from "@material-ui/core";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";
import _ from "lodash";
import styled from "styled-components";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";
import i18n from "../../../locales";

interface ScreenshotModalProps {
    open?: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    backgroundColor?: string;
    exclusionClasses?: string[];
    hideTitle?: boolean;
    isSquareChart?: boolean;
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
}: ScreenshotModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleDownload = useCallback(() => {
        if (ref.current) {
            downloadHtmlElement(ref.current, title.replace(".", "_"), { backgroundColor, exclusionClasses });
        }
    }, [backgroundColor, exclusionClasses, title]);

    return (
        <StyledModal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <StyledBox backgroundColor={backgroundColor} $isSquareChart={isSquareChart}>
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
                </Header>
                <Content ref={ref}>
                    <ScreenshotContainer className="screenshot-container">{children}</ScreenshotContainer>
                </Content>
            </StyledBox>
        </StyledModal>
    );
}

export default ScreenshotModal;

const StyledBox = styled(Box)<{ backgroundColor: string; $isSquareChart?: boolean }>`
    position: absolute;
    left: 5%;
    top: ${props => (props?.$isSquareChart ? "1%" : "5%")};
    width: 90vw;
    background-color: ${props => props?.backgroundColor ?? "#FFFFFF"};
    border-radius: 10px;
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
