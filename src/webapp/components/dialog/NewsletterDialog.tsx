import React from "react";
import { Dialog, Button, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";

export default function NewsletterDialog() {
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
                {i18n.t("Get updates from UHC watch")}
            </StyledButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{i18n.t("Get updates from UHC watch")}</DialogTitle>
                <StyledDialogContent>
                    <Typography component={"p"} id="alert-dialog-description">
                        {i18n.t(
                            "Sign up for our newsletter and get updates whenever we add new information or resources."
                        )}
                        <br />
                        <br />
                        {i18n.t("Give us feedback on UHC watch.")}
                        <br />
                        <br />
                        {i18n.t("To sign up or to send feedback, email")}{" "}
                        <a
                            href="mailto:uhcwatch@who.int?subject=I%20want%20to%20receive%20UHC%20watch%20updates"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            uhcwatch@who.int
                        </a>
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
    text-transform: unset;
`;
