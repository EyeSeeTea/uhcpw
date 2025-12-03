import { Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ReactMarkdown, { Components } from "react-markdown";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import React from "react";

type FullScreenPopupProps = {
    isOpen: boolean;
    onClose?: () => void;
    text: string;
    linkText?: string;
    linkUrl?: string;
};

export const PopUp: React.FC<FullScreenPopupProps> = props => {
    const { isOpen, onClose, text, linkText, linkUrl } = props;
    const { redirectWithExternalLink } = useAnalytics();

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Paragraph variant="body1" gutterBottom className="paa">
                    {children}
                </Paragraph>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
            a: ({ ...props }) => (
                <TextLink href={props.href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
                    {props.children}
                </TextLink>
            ),
        }),
        [redirectWithExternalLink]
    );

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
                    <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
                    {linkText && linkUrl && (
                        <TextLink href={linkUrl} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
                            {linkText}
                        </TextLink>
                    )}
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

const Paragraph = styled(Typography)`
    font-family: Lato;
    margin-block: 10px;
    font-size: 16px;
    color: ${colors.black};

    &:first-child {
        margin-block-start: 0;
    }

    &:last-child {
        margin-block-end: 0;
    }
`;

const StyledLi = styled.li`
    font-family: Lato;
    font-size: 1rem;
    line-height: 1.43;
    color: ${colors.black};
`;

const StyledUl = styled.ul`
    font-family: Lato;
    font-size: 1rem;
    padding-inline-start: 14px;
    color: ${colors.black};
    margin-inline-start: 0;
    margin-block-start: 0;
    margin-block-end: 0;
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;
