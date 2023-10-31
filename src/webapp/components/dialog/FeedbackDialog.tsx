import React from "react";
import { Dialog, Button, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import styled from "styled-components";

export default function FeedbackDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <StyledButton variant="outlined" onClick={handleClickOpen}>
                Send feedback
            </StyledButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Send feedback</DialogTitle>
                <StyledDialogContent>
                    <Typography component={"p"} id="alert-dialog-description">
                        We are eager to hear how you use UHCW and how we can improve the platform for all its users. To
                        contact the team, uhcwatch@who.int
                    </Typography>
                </StyledDialogContent>
            </Dialog>
        </>
    );
}

const StyledDialogContent = styled(DialogContent)`
    padding-block-end: 24px;
`;

const StyledButton = styled(Button)`
    position: fixed;
    inset-block-end: 0;
    inset-inline-end: 20%;
    z-index: 1800;
    border-color: #ff8d4e;
    background-color: #ff8d4e;
    border-radius: 4px 4px 0 0;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1), -2px 0 4px rgba(0, 0, 0, 0.1), 2px 0 4px rgba(0, 0, 0, 0.1);
    color: white;
    :hover {
        background: #ff5c01;
        border-color: #ff5c01;
    }
`;
