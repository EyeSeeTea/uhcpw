import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ReactMarkdown from "react-markdown";
import i18n from "@eyeseetea/d2-ui-components/locales";

type DialogType = {
    isOpen: boolean;
    onClose: () => void;
    dialogInfo: string;
};

export const NotesDialog: React.FC<DialogType> = ({ isOpen, onClose, dialogInfo }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContainer>
                <DialogTitle style={{ fontSize: "18px", paddingBottom: "2px" }}>{i18n.t("Notes:")}</DialogTitle>
                <DialogContent>
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => (
                                <Typography style={{ color: "#242626", marginBottom: 8 }}>{children}</Typography>
                            ),
                        }}
                    >
                        {dialogInfo}
                    </ReactMarkdown>
                </DialogContent>
                <CloseIconButton onClick={onClose}>
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
`;

const CloseIconButton = styled(IconButton)`
    position: absolute;
    right: 10px;
    top: 10px;
`;
