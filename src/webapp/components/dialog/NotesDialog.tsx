import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { colors } from "../../pages/app/themes/dhis2.theme";

type DialogType = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    dialogInfo: {
        title?: string;
        infoNotes: string[];
        sourceName: string;
        sourceLink: string;
    };
};

export const NotesDialog: React.FC<DialogType> = ({
    isOpen,
    setIsOpen,
    dialogInfo: { title = "Notes:", infoNotes, sourceName },
}) => {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <DialogContainer>
                <DialogTitle style={{ fontSize: "18px", paddingBottom: "2px" }}>{title}</DialogTitle>
                <DialogContent>
                    {infoNotes.map(note => (
                        <Typography key={note} style={{ color: "#242626" }}>
                            {note}
                        </Typography>
                    ))}
                    <Typography style={{ color: "#242626", marginTop: "10px" }}>
                        Source:{" "}
                        <a href={"/"} style={{ color: colors.accentPrimary, textDecoration: "none" }}>
                            {sourceName}
                        </a>
                    </Typography>
                </DialogContent>
                <CloseIconButton onClick={() => setIsOpen(false)}>
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
