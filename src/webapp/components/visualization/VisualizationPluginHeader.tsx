import React, { useMemo } from "react";
import styled from "styled-components";
import { Button, IconButton, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";
import CloseIcon from "@material-ui/icons/Close";

import i18n from "../../../locales";
import { NotesDialog } from "../dialog/NotesDialog";
import { Country } from "../../../domain/entities/Country";
import {
    BOSNIA_AND_HERZEGOVINA_LEVEL_4,
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
} from "../../../data/repositories/countries/CountryD2Repository";
import { FullScreenNotesDialog } from "../dialog/FullScreenNotesDialog";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { Id } from "../../../domain/entities/Ref";

interface VisualizationPluginHeaderProps {
    visualizationDialogInfo: string;
    visualizationId: string;
    chartFriendlyName?: string;
    categoryTag?: string;
    showInfo: boolean;
    onDownloadExcel?: () => void;
    onDownloadImage?: () => void;
    onShowInfo?: () => void;
    onCloseInfo?: () => void;
    onClose?: () => void;
    useHeaderForCountryPage?: boolean;
    showCountryTag?: boolean;
    countries: Country[];
    currentCountryOrRegion?: Id;
    isScreenshot?: boolean;
    reducePaddingBottom?: boolean;
    showDialogInFullScreen?: boolean;
}

export const VisualizationPluginHeader: React.FC<VisualizationPluginHeaderProps> = React.memo(
    ({
        visualizationDialogInfo,
        visualizationId,
        chartFriendlyName,
        showInfo,
        categoryTag,
        onShowInfo,
        onCloseInfo,
        onDownloadExcel,
        onDownloadImage,
        countries,
        currentCountryOrRegion,
        useHeaderForCountryPage = false,
        showCountryTag = false,
        isScreenshot = false,
        reducePaddingBottom = false,
        showDialogInFullScreen = false,
        onClose,
    }) => {
        const currentCountryName = useMemo(() => {
            if (currentCountryOrRegion) {
                const countryId =
                    (currentCountryOrRegion === FEDERACIJA_BOSNE_I_HERCEGOVINE ||
                        currentCountryOrRegion === REPUBLICA_SERPSKA) &&
                    visualizationId === "OB4SCQfCzwz"
                        ? BOSNIA_AND_HERZEGOVINA_LEVEL_4
                        : currentCountryOrRegion;

                return countries.find(({ id }) => id === countryId)?.name;
            }
        }, [countries, currentCountryOrRegion, visualizationId]);

        return (
            <DataHeader
                className="visualization-plugin-header"
                $isCountryPage={useHeaderForCountryPage}
                $reducePaddingBottom={reducePaddingBottom}
            >
                <Row>
                    {useHeaderForCountryPage ? (
                        <>
                            <Row>
                                <StyledTitle isScreenshot={isScreenshot} variant="h6" color="textPrimary">
                                    {chartFriendlyName}
                                </StyledTitle>
                            </Row>

                            <RowWithGap $gap={6}>
                                {showCountryTag && currentCountryName ? (
                                    <Tag className="category">{currentCountryName}</Tag>
                                ) : (
                                    categoryTag && <Tag className="category">{categoryTag}</Tag>
                                )}
                                <RowWithGap $gap={0}>
                                    {onShowInfo && (
                                        <StyledIconButton onClick={onShowInfo} $color="#185698" padding="4px">
                                            <CustomInfoIconCountry color="primary" className="info-button" />
                                        </StyledIconButton>
                                    )}

                                    {onDownloadExcel && (
                                        <StyledIconButton onClick={onDownloadExcel} $color="white" padding="6px">
                                            <CustomCloudIcon color="primary" className="download-button" />
                                        </StyledIconButton>
                                    )}

                                    {onDownloadImage && (
                                        <StyledIconButton onClick={onDownloadImage} $color="white" padding="6px">
                                            <CustomImageIcon color="primary" className="download-button" />
                                        </StyledIconButton>
                                    )}
                                    {onClose && (
                                        <StyledIconButton onClick={onClose} $color="white" padding="6px">
                                            <CustomCloseIcon color="primary" className="close-button" />
                                        </StyledIconButton>
                                    )}
                                </RowWithGap>
                            </RowWithGap>
                        </>
                    ) : (
                        <>
                            <Row>
                                <Title
                                    isScreenshot={isScreenshot}
                                    variant="h6"
                                    color="textPrimary"
                                    style={{ marginLeft: 20 }}
                                >
                                    {chartFriendlyName}
                                    {onShowInfo && (
                                        <Button>
                                            <CustomInfoIconIndicators
                                                color="primary"
                                                className="info-button"
                                                htmlColor="#185698"
                                                onClick={onShowInfo}
                                            />
                                        </Button>
                                    )}
                                </Title>
                            </Row>

                            <Column>
                                {onDownloadExcel && (
                                    <DownloadButton
                                        variant="contained"
                                        endIcon={<DownloadIcon />}
                                        color="primary"
                                        style={{ marginLeft: 40, marginBottom: 20 }}
                                        onClick={onDownloadExcel}
                                        className="download-button"
                                    >
                                        <Typography>{i18n.t("Download")}</Typography>
                                    </DownloadButton>
                                )}

                                {onDownloadImage && (
                                    <DownloadButton
                                        variant="contained"
                                        endIcon={<ImageRoundedIcon />}
                                        color="primary"
                                        style={{ marginLeft: 40 }}
                                        onClick={onDownloadImage}
                                        className="download-button"
                                    >
                                        <Typography>{i18n.t("Download")}</Typography>
                                    </DownloadButton>
                                )}
                            </Column>
                        </>
                    )}
                </Row>
                {showInfo &&
                    (showDialogInFullScreen ? (
                        <FullScreenNotesDialog
                            isOpen={showInfo}
                            onClose={onCloseInfo}
                            dialogInfo={visualizationDialogInfo}
                        />
                    ) : (
                        <NotesDialog isOpen={showInfo} onClose={onCloseInfo} dialogInfo={visualizationDialogInfo} />
                    ))}
            </DataHeader>
        );
    }
);

const DataHeader = styled.div<{ $isCountryPage?: boolean; $reducePaddingBottom?: boolean }>`
    padding-block-start: ${props => (props.$isCountryPage ? "10px" : "48px")};
    padding-block-end: ${props => (props.$reducePaddingBottom ? "10px" : "48px")};
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0px;
    align-items: flex-start;
    gap: 1rem;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-block-start: 9px;
    align-items: center;
`;

const RowWithGap = styled.div<{ $gap: number }>`
    display: flex;
    flex-direction: row;
    margin-bottom: 0px;
    align-items: center;
    gap: ${props => props.$gap}px;
`;

const DownloadButton = styled(Button)`
    border-radius: 20px;
    padding: 0px 32px;
    height: 42px;
    background: #185698;
    text-transform: initial;
`;

const StyledIconButton = styled(IconButton)<{ $color: string; padding: string }>`
    padding: ${props => props.padding};
    color: ${props => props.$color};
`;

const CustomInfoIconIndicators = styled(InfoIcon)`
    color: #185698;
    font-size: 26px;
`;

const CustomInfoIconCountry = styled(InfoIcon)`
    color: #185698;
    font-size: 33px;
`;

const CustomImageIcon = styled(ImageRoundedIcon)`
    color: white;
    background-color: #185698;
    border-radius: 50%;
    padding: 4px;
    font-size: 20px;
`;

const CustomCloseIcon = styled(CloseIcon)`
    color: white;
    background-color: #185698;
    border-radius: 50%;
    padding: 4px;
    font-size: 20px;
`;

const CustomCloudIcon = styled(DownloadIcon)`
    color: white;
    background-color: #185698;
    border-radius: 50%;
    padding: 4px;
    font-size: 20px;
`;

const Tag = styled.div`
    border-radius: 20px;
    background-color: #185698;
    color: white;
    padding: 6px 16px;
    display: inline-block;
    white-space: nowrap;
    font-size: 14px;
    font-weight: regular;
`;

const Title = styled(Typography)<{ isScreenshot: boolean }>`
    font-size: ${props => (props.isScreenshot ? "1.1rem" : "1.2rem")};
    white-space: "normal";
`;

const StyledTitle = styled(Typography)<{ isScreenshot: boolean }>`
    font-size: ${props => (props.isScreenshot ? "1.1rem" : "1.2rem")};
    white-space: "normal";
    margin-left: 20px;
    width: 100%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-left: 15px;
    }
`;
