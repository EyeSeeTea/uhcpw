import { Button, IconButton, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import GridOnIcon from "@material-ui/icons/GridOn";
import GetAppIcon from "@material-ui/icons/GetApp";
import { NotesDialog } from "../dialog/NotesDialog";

interface VisualizationPluginHeaderProps {
    visualizationDialogInfo: string;
    chartFriendlyName?: string;
    categoryTag?: string;
    showInfo: boolean;
    onDownloadExcel: () => void;
    onDownloadImage: () => void;
    onShowInfo: () => void;
    onCloseInfo: () => void;
    useHeaderForCountryPage?: boolean;
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
        useHeaderForCountryPage = false,
    }) => {
        return (
            <DataHeader>
                <Row>
                    {useHeaderForCountryPage ? (
                        <>
                            <Row>
                                <Typography variant="h6" color="textPrimary" style={{ marginLeft: 20 }}>
                                    {chartFriendlyName}
                                </Typography>
                            </Row>

                            <RowWithGap $gap={20}>
                                {categoryTag && <Tag className="category">{categoryTag}</Tag>}
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
                                </Typography>
                                <Button>
                                    <CustomInfoIcon
                                        color="primary"
                                        className="info-button"
                                        htmlColor="#185698"
                                        onClick={onShowInfo}
                                    />
                                </Button>
                            </Row>

                            <Column>
                                <DownloadButton
                                    variant="contained"
                                    startIcon={<GridOnIcon />}
                                    color="primary"
                                    style={{ marginLeft: 20, marginBottom: 20 }}
                                    onClick={onDownloadExcel}
                                    className="download-button"
                                >
                                    <Typography>{i18n.t("Download")}</Typography>
                                </DownloadButton>

                                <DownloadButton
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    color="primary"
                                    style={{ marginLeft: 20 }}
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
    align-items: center;
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
