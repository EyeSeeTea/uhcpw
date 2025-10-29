import { colors, Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ReactMarkdown from "react-markdown";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

type DialogType = {
    isOpen: boolean;
    onClose?: () => void;
    dialogInfo: string;
};

export const NotesDialog: React.FC<DialogType> = ({ isOpen, onClose, dialogInfo }) => {
    const { redirectWithExternalLink } = useAnalytics();

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                style: {
                    overflowY: "unset",
                },
            }}
        >
            <DialogContainer>
                <DialogContent>
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => (
                                <Typography style={{ color: "#242626", marginBottom: 8 }}>{children}</Typography>
                            ),
                            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
                            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
                            a: ({ ...props }) => (
                                <TextLink
                                    href={props.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={redirectWithExternalLink}
                                >
                                    {props.children}
                                </TextLink>
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
    overflow-y: auto;
    div.MuiDialogContent-root {
        padding-inline: 16px;
        padding-block-start: 16px;
        padding-block-end: 8px;
    }
`;

const CloseIconButton = styled(IconButton)`
    position: absolute;
    right: 10px;
    top: 10px;
`;

const StyledLi = styled.li`
    line-height: 1.43;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
`;

const TextLink = styled.a`
    color: ${colors.blue};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;
