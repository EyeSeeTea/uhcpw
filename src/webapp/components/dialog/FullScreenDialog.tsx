import { Button, Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { Rotate } from "../rotate/Rotate";
import i18n from "@eyeseetea/d2-ui-components/locales";

type FullScreenDialogProps = {
    isOpen: boolean;
    children: React.ReactNode;
    onClose?: () => void;
    title?: string;
    ref?: React.RefObject<HTMLDivElement>;
    forceRotation?: boolean;
    hasPadding?: boolean;
};

export const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
    isOpen,
    onClose,
    children,
    ref,
    title,
    forceRotation,
    hasPadding = true,
}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} fullScreen>
            <Rotate enableRotation={forceRotation}>
                <DialogContainer ref={ref} hasPadding={hasPadding}>
                    {onClose && <CloseButton onClick={onClose}>{i18n.t("Accept")}</CloseButton>}

                    <DialogContent style={{ padding: hasPadding ? "8px 24px;" : "0" }}>
                        {title && <Title variant="h6">{title}</Title>}

                        {children}
                    </DialogContent>
                </DialogContainer>
            </Rotate>
        </Dialog>
    );
};

//add prop to indicate padding yes or not
const DialogContainer = styled.div<{ hasPadding?: boolean }>`
    padding: ${({ hasPadding }) => (hasPadding ? "25px" : "0")};
    width: 100%;
`;

const Title = styled(Typography)`
    font-weight: bold !important;
    margin-block-end: 16px;
`;

const CloseButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    width: 80px;
    text-transform: none;
    white-space: nowrap;
    background: #185698;
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 1000;
    color: white;
`;
