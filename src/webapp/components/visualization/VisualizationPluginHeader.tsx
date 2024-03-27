import React, { useMemo } from "react";
import styled from "styled-components";
import { Button, IconButton, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import GridOnIcon from "@material-ui/icons/GridOn";
import GetAppIcon from "@material-ui/icons/GetApp";

import i18n from "../../../locales";
import { NotesDialog } from "../dialog/NotesDialog";
import { Country } from "../../../domain/entities/Country";

interface VisualizationPluginHeaderProps {
    visualizationDialogInfo: {
        title?: string;
        infoNotes: string[];
        sourceName: string;
        sourceLink: string;
    };
    chartFriendlyName?: string;
    categoryTag?: string;
    showInfo: boolean;
    onDownloadExcel: () => void;
    onDownloadImage: () => void;
    onShowInfo: () => void;
    onCloseInfo: () => void;
    useHeaderForCountryPage?: boolean;
    showCountryTag?: boolean;
    countries: Country[];
    currentCountry?: string;
}

export const VisualizationPluginHeader: React.FC<VisualizationPluginHeaderProps> = React.memo(
    ({
        visualizationDialogInfo,
        chartFriendlyName,
        showInfo,
        categoryTag,
        onShowInfo,
        onCloseInfo,
        onDownloadExcel,
        onDownloadImage,
        countries,
        currentCountry,
        useHeaderForCountryPage = false,
        showCountryTag = false,
    }) => {
        const currentCountryName = useMemo(() => {
            if (currentCountry) {
                return countries.find(({ id }) => id === currentCountry)?.name;
            }
        }, [countries, currentCountry]);

        return (
            <DataHeader className="visualization-plugin-header">
                <Row>
                    {useHeaderForCountryPage ? (
                        <>
                            <Row>
                                <Typography variant="h6" color="textPrimary" style={{ marginLeft: 20 }}>
                                    {chartFriendlyName}
                                </Typography>
                            </Row>

                            <RowWithGap $gap={20}>
                                {showCountryTag && currentCountryName ? (
                                    <Tag className="category">{currentCountryName}</Tag>
                                ) : (
                                    categoryTag && <Tag className="category">{categoryTag}</Tag>
                                )}
                                <RowWithGap $gap={0}>
                                    <StyledIconButton onClick={onShowInfo} $color="#185698">
                                        <CustomInfoIcon color="primary" className="info-button" />
                                    </StyledIconButton>
                                    <StyledIconButton onClick={onDownloadExcel} $color="white">
                                        <CustomGridOnIcon color="primary" className="download-button" />
                                    </StyledIconButton>
                                    <StyledIconButton onClick={onDownloadImage} $color="white">
                                        <CustomGetAppIcon color="primary" className="download-button" />
                                    </StyledIconButton>
                                </RowWithGap>
                            </RowWithGap>
                        </>
                    ) : (
                        <>
                            <Row>
                                <Typography variant="h6" color="textPrimary" style={{ marginLeft: 20 }}>
                                    {chartFriendlyName}
                                    <Button>
                                        <CustomInfoIcon
                                            color="primary"
                                            className="info-button"
                                            htmlColor="#185698"
                                            onClick={onShowInfo}
                                        />
                                    </Button>
                                </Typography>
                            </Row>

                            <Column>
                                <DownloadButton
                                    variant="contained"
                                    startIcon={<GridOnIcon />}
                                    color="primary"
                                    style={{ marginLeft: 40, marginBottom: 20 }}
                                    onClick={onDownloadExcel}
                                    className="download-button"
                                >
                                    <Typography>{i18n.t("Download")}</Typography>
                                </DownloadButton>

                                <DownloadButton
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    color="primary"
                                    style={{ marginLeft: 40 }}
                                    onClick={onDownloadImage}
                                    className="download-button"
                                >
                                    <Typography>{i18n.t("Download")}</Typography>
                                </DownloadButton>
                            </Column>
                        </>
                    )}
                </Row>
                {showInfo && (
                    <NotesDialog isOpen={showInfo} onClose={onCloseInfo} dialogInfo={visualizationDialogInfo} />
                )}
            </DataHeader>
        );
    }
);

const DataHeader = styled.div`
    padding: 48px 0px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0px;
    align-items: flex-start;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 0px;
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

const StyledIconButton = styled(IconButton)<{ $color: string }>`
    padding: 5px;
    color: ${props => props.$color};
`;

const CustomInfoIcon = styled(InfoIcon)`
    color: #185698;
    font-size: 26px;
`;

const CustomGetAppIcon = styled(GetAppIcon)`
    color: white;
    background-color: #185698;
    border-radius: 50%;
    padding: 3px;
    font-size: 17px;
`;

const CustomGridOnIcon = styled(GridOnIcon)`
    color: white;
    background-color: #185698;
    border-radius: 50%;
    padding: 3px;
    font-size: 17px;
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
