import { DialogContent, DialogContentText, DialogTitle, Typography } from "@material-ui/core";
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

    const onClose = () => {
        setSearchTerm("");
        setSelectedFilter("All");
        setIsOpen(false);
    };

    const onTextSearchChange = (filter: string) => {
        setSearchTerm(filter);
        if (selectedFilter !== "All") {
            setSelectedFilter("All");
        }
    };

    const onLetterFilterChange = (filter: string) => {
        setSelectedFilter(filter);
        if (searchTerm) {
            setSearchTerm("");
        }
    };

    return (
        <Dialog open={isOpen} onRequestClose={onClose}>
            <StyledDialogTitle disableTypography>
                <Typography variant="h4">{i18n.t("Glossary of terms")}</Typography>
            </StyledDialogTitle>
            <DialogContent>
                <FilterContainer>
                    <SearchInput
                        value={searchTerm}
                        onChange={filter => onTextSearchChange(filter)}
                        style={{ marginBottom: "15px" }}
                    />
                    {filters.map(filter => {
                        return (
                            <FilterButton
                                key={filter}
                                selected={filter === selectedFilter}
                                onClick={() => onLetterFilterChange(filter)}
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
                                <StyledEntryTitle>
                                    {" "}
                                    <Typography variant="h6">{i18n.t(entry.title)}</Typography>
                                </StyledEntryTitle>
                                <StyledEntryText>
                                    <Typography>{i18n.t(entry.text)}</Typography>
                                </StyledEntryText>
                            </>
                        ))}
                </EntriesContainer>
                <StyledIconButton onClick={onClose}>
                    <CloseIcon />
                </StyledIconButton>
            </DialogContent>
        </Dialog>
    );
};

const StyledDialogTitle = styled(DialogTitle)`
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
    color: ${colors.greyBlack};
`;

const StyledEntryText = styled(DialogContentText)`
    color: ${colors.gradientPrimary};
`;
