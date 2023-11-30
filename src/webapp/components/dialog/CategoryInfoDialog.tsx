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

const CategoryDescriptions = [
    {
        value: "uG2PbDfOc0w",
        title: "Population coverage",
        description:
            "This section focuses on the basis for entitlement to publicly financed health care. It describes the basis for entitlement; entitlements for refugees, asylum seekers and undocumented migrants; and the groups of people who lack coverage and their entitlements.",
    },
    {
        value: "W4CqlzcDPB1",
        title: "Service coverage",
        description:
            "This section focuses on the publicly financed benefits package. It provides information on the institutions and processes involved in defining the benefits package, the types of health care that are not so well covered, the user pathway for covered services, informal payments, waiting times and other access issues.",
    },
    {
        value: "mCMVwmnGWJF",
        title: "User charges",
        description:
            "This section focuses on user charges (co-payments) for covered services. It provides an overview of the types of user charges and protection mechanisms in place. More detailed information on the level and design of user charges is in the section on user charges by type of health care.",
    },
    {
        value: "uImM4yTeeV3",
        title: "Voluntary health insurance",
        description:
            "This section focuses on the role voluntary health insurance (VHI) plays in relation to publicly financed health care, the share of population covered by VHI and its contribution to spending on health. It provides information on who sells and buys VHI, who regulates VHI and whether there are policies in place to make VHI more accessible or affordable.",
    },
    {
        value: "e6cfI6vWYEF",
        title: "Main gaps in publicly financed coverage",
        description:
            "This section highlights the main gaps in population and service coverage and gaps caused by user charges.",
    },
];

export const CategoryInfoDialog: React.FC<DialogType> = ({ isOpen, onClose, category }) => {
    const selectedCategory = CategoryDescriptions.find(desc => desc.value === category.value);

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
                    {selectedCategory ? (
                        <>
                            <Title variant="body2">{i18n.t(category.text)}</Title>
                            <Typography variant="body2">{i18n.t(selectedCategory?.description)}</Typography>
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
