import { DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { Dialog, IconButton } from "material-ui";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import i18n from "../../../../locales";
import SearchInput from "../../search-input/SearchInput";
import { useState } from "react";
import { useAbout } from "../../../pages/about/useAbout";
import { FilterButton } from "../../about/experts-network/ExpertsNetwork";
import CloseIcon from "@material-ui/icons/Close";
import glossaryData from "./glossaryData.json";

type GlossaryProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Glossary: React.FC<GlossaryProps> = ({ isOpen, setIsOpen }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const { filters } = useAbout();

    return (
        <Dialog open={isOpen} onRequestClose={() => setIsOpen(false)}>
            <StyledDialogTitle disableTypography>{i18n.t("Glossary of terms")}</StyledDialogTitle>
            <DialogContent>
                <FilterContainer>
                    <SearchInput value={searchTerm} onChange={e => setSearchTerm(e)} style={{ marginBottom: "15px" }} />
                    {filters.map(filter => {
                        return (
                            <FilterButton
                                key={filter}
                                selected={filter === selectedFilter}
                                onClick={() => setSelectedFilter(filter)}
                            >
                                {filter}
                            </FilterButton>
                        );
                    })}
                </FilterContainer>
                <EntriesContainer>
                    {glossaryData
                        .filter(entry => {
                            return (
                                (entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    entry.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
                                (selectedFilter !== "All"
                                    ? entry.title.charAt(0).toLowerCase() === selectedFilter.toLowerCase()
                                    : entry)
                            );
                        })
                        .map(entry => (
                            <>
                                <StyledEntryTitle>{i18n.t(entry.title)}</StyledEntryTitle>
                                <StyledEntryText>{i18n.t(entry.text)}</StyledEntryText>
                            </>
                        ))}
                </EntriesContainer>
                <StyledIconButton onClick={() => setIsOpen(false)}>
                    <CloseIcon />
                </StyledIconButton>
            </DialogContent>
        </Dialog>
    );
};

const StyledDialogTitle = styled(DialogTitle)`
    font-size: 30px;
    margin-bottom: 15px;
    color: ${colors.greyBlack};
`;

const StyledIconButton = styled(IconButton)`
    position: absolute !important;
    right: 4px;
    top: 4px;
`;

const EntriesContainer = styled.div`
    overflow-y: auto;
    height: 400px;
`;

const FilterContainer = styled.div`
    margin-bottom: 20px;
`;

const StyledEntryTitle = styled(DialogContentText)`
    font-size: large;
    color: ${colors.greyBlack};
`;

const StyledEntryText = styled(DialogContentText)`
    font-size: medium;
    ${colors.gradientPrimary};
`;
