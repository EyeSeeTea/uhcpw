import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";

const titleId = "video-dialog-title";

type VideoDialogProps = {
    open: boolean;
    title: string;
    onClose: () => void;
};

export const VideoDialog: React.FC<VideoDialogProps> = ({ open, title, onClose, children }) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby={titleId}>
        <TitleBar id={titleId} disableTypography>
            <Typography variant="h6">{title}</Typography>
            <IconButton aria-label={i18n.t("Close")} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </TitleBar>
        <Content>{children}</Content>
    </Dialog>
);

const TitleBar = styled(DialogTitle)`
    && {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const Content = styled(DialogContent)`
    && {
        padding-bottom: 24px;
    }
`;
