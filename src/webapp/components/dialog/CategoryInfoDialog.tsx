import { Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import { CategoryOption } from "../policy-explorer/category-selector/CategorySelector";
import CloseIcon from "@material-ui/icons/Close";

type DialogType = {
    isOpen: boolean;
    category: CategoryOption;
    onClose: () => void;
};

export const CategoryInfoDialog: React.FC<DialogType> = ({ isOpen, onClose, category }) => {
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
                            <Typography variant="body2">{i18n.t(category.description)}</Typography>
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
