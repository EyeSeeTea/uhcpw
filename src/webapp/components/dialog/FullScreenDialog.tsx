import { Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { Rotate } from "../rotate/Rotate";

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
                    {onClose && (
                        <CloseIconButton onClick={onClose}>
                            <StyledCloseIcon />
                        </CloseIconButton>
                    )}

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
