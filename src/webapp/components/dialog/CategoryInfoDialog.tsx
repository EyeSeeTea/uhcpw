import { Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ReactMarkdown from "react-markdown";

import i18n from "../../../locales";
import { CategoryOption } from "../policy-explorer/category-selector/useCategorySelector";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { createMarkdownComponents } from "./markdownComponents";
import { useMemo } from "react";

type DialogType = {
    isOpen: boolean;
    category: CategoryOption;
    onClose: () => void;
};

export const CategoryInfoDialog: React.FC<DialogType> = ({ isOpen, onClose, category }) => {
    const { redirectWithExternalLink } = useAnalytics();

    const markdownComponents = useMemo(
        () => createMarkdownComponents(redirectWithExternalLink),
        [redirectWithExternalLink]
    );

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContainer>
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
                <DialogContent>
                    {category.description ? (
                        <>
                            <Title variant="body2">{i18n.t(category.text)}</Title>
                            <ReactMarkdown components={markdownComponents}>{category.description}</ReactMarkdown>
                        </>
                    ) : (
                        <Typography variant="body2">{i18n.t("No information available for this category")}</Typography>
                    )}
                </DialogContent>
            </DialogContainer>
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
