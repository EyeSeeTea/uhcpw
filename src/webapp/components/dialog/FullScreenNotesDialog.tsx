import { Dialog, DialogContent, IconButton } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ReactMarkdown from "react-markdown";
import { Rotate } from "../rotate/Rotate";
import { useOrientation } from "../rotate/useOrientation";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { createMarkdownComponents } from "./markdownComponents";
import { useMemo } from "react";

type DialogType = {
    isOpen: boolean;
    onClose?: () => void;
    dialogInfo: string;
    isRotated?: boolean;
};

export const FullScreenNotesDialog: React.FC<DialogType> = ({ isOpen, onClose, dialogInfo }) => {
    const orientation = useOrientation();
    const { redirectWithExternalLink } = useAnalytics();

    const markdownComponents = useMemo(
        () => createMarkdownComponents(redirectWithExternalLink),
        [redirectWithExternalLink]
    );

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                style: {
                    height: "100%",
                    width: "100vw",
                    overflowY: "unset",
                },
            }}
        >
            <DialogContainer>
                <Rotate enableRotation={true} width="75vh" height="70vw">
                    <DialogContent>
                        <ReactMarkdown components={markdownComponents}>{dialogInfo}</ReactMarkdown>
                    </DialogContent>
                </Rotate>

                <CloseIconButton onClick={onClose} $orientation={orientation}>
                    <CloseIcon
                        style={{
                            color: "white",
                            backgroundColor: "#035fa7",
                            borderRadius: "50%",
                            padding: "4px",
                            fontSize: "12px",
                        }}
                    />
                </CloseIconButton>
            </DialogContainer>
        </Dialog>
    );
};

const DialogContainer = styled.div`
    padding: 25px;
    div.MuiDialogContent-root {
        padding-inline: 16px;
        padding-block-start: 16px;
        padding-block-end: 8px;
    }
`;

const CloseIconButton = styled(IconButton)<{ $orientation: "portrait" | "landscape" }>`
    position: absolute;
    right: 5px;
    top: ${props => (props.$orientation === "portrait" ? "unset" : "5px")};
    bottom: ${props => (props.$orientation === "portrait" ? "10px" : "unset")};
`;
