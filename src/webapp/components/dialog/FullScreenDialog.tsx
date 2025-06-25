import { Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { Rotate } from "../rotate/Rotate";

type FullScreenDialogProps = {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
    title?: string;
    ref?: React.RefObject<HTMLDivElement>;
    forceRotation?: boolean;
};

export const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
    isOpen,
    onClose,
    children,
    ref,
    title,
    forceRotation,
}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} fullScreen>
            {forceRotation && (
                <Rotate>
                    <DialogContainer ref={ref}>
                        <CloseIconButton onClick={onClose}>
                            <StyledCloseIcon />
                        </CloseIconButton>

                        <DialogContent>
                            {title && <Title variant="h6">{title}</Title>}

                            {children}
                        </DialogContent>
                    </DialogContainer>
                </Rotate>
            )}
            {!forceRotation && (
                <DialogContainer ref={ref}>
                    <CloseIconButton onClick={onClose}>
                        <StyledCloseIcon />
                    </CloseIconButton>

                    <DialogContent>
                        {title && <Title variant="h6">{title}</Title>}

                        {children}
                    </DialogContent>
                </DialogContainer>
            )}
        </Dialog>
    );
};

const DialogContainer = styled.div`
    padding: 25px;
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
