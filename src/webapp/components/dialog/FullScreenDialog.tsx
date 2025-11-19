import { Button, Dialog, DialogContent, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Rotate } from "../rotate/Rotate";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { useRealViewportHeight } from "./useRealViewPortHeight";
import { useViewportKey } from "./useViewportKey";

type FullScreenDialogProps = {
    isOpen: boolean;
    children: React.ReactNode;
    onClose?: () => void;
    title?: string;
    ref?: React.RefObject<HTMLDivElement>;
    forceRotation?: boolean;
    hasPadding?: boolean;
    recalculateHeight?: boolean;
};

const baseStyles = {
    width: "100vw",
    margin: 0,
    padding: 0,
};

export const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
    isOpen,
    onClose,
    children,
    ref,
    title,
    forceRotation,
    hasPadding = true,
    recalculateHeight = false,
}) => {
    useRealViewportHeight();
    const viewportKey = useViewportKey();

    return (
        <Dialog
            key={recalculateHeight ? viewportKey : undefined}
            open={isOpen}
            onClose={onClose}
            fullScreen
            PaperProps={{
                style: recalculateHeight
                    ? {
                          height: "var(--vh)",
                          ...baseStyles,
                      }
                    : {
                          minHeight: "100%",
                          ...baseStyles,
                      },
            }}
        >
            <DialogContainer ref={ref} hasPadding={hasPadding}>
                <Rotate enableRotation={forceRotation}>
                    {onClose && <CloseButton onClick={onClose}>{i18n.t("Save")}</CloseButton>}

                    <DialogContent
                        style={{
                            padding: hasPadding ? "8px 24px" : "0",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {title && <Title variant="h6">{title}</Title>}

                        <div style={{ flex: 1 }}>{children}</div>
                    </DialogContent>
                </Rotate>
            </DialogContainer>
        </Dialog>
    );
};

const DialogContainer = styled.div<{ hasPadding?: boolean }>`
    padding-top: ${({ hasPadding }) => (hasPadding ? "25px" : "0")};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
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
    z-index: 1;
    color: white;
`;
