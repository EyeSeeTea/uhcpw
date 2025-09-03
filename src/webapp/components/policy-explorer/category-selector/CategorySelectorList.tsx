import React from "react";
import { Typography, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { TreeView } from "@material-ui/lab";
import styled from "styled-components";

import i18n from "../../../../locales";
import SearchInput from "../../search-input/SearchInput";
import { Node } from "./Node";
import { Leaf } from "./Leaf";
import { CategoryOption, SubcategoryOption } from "./useCategorySelector";
import { isEmpty } from "lodash";

interface CategorySelectorListProps {
    searchTerm: string;
    handleSearchChange: (term: string) => void;
    placeholder: string;
    handleSelectAll: () => void;
    disableSelectAll: boolean;
    handleClear: () => void;
    filteredCategories: CategoryOption[];
    isClearDisabled: boolean;
    handleSelectedAllSubcategories: (categoryId: string, selected: boolean, subcategories: SubcategoryOption[]) => void;
    handleSubcategoriesChange: (parentCategoryId: string, subcategoryId: string, selected: boolean) => void;
    isAllCategorySelected: (categoryId: string) => boolean;
    isSubcategorySelected: (categoryId: string, subcategoryId: string) => boolean;
    fullScreen: boolean;
    selectedCategoriesWithSubcategories?: Record<string, string[]>;
}

export const CategorySelectorList = React.memo(
    ({
        searchTerm,
        handleSearchChange,
        placeholder,
        handleSelectAll,
        disableSelectAll,
        handleClear,
        filteredCategories,
        handleSelectedAllSubcategories,
        handleSubcategoriesChange,
        isAllCategorySelected,
        isSubcategorySelected,
        selectedCategoriesWithSubcategories,
    }: CategorySelectorListProps) => {
        return (
            <div role="listbox">
                <SearchInput
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        height: "20px",
                        background: "#f2f9fd",
                        border: "1px solid #cfe9f7",
                        borderRadius: "20px",
                    }}
                />
                <br />
                <Container>
                    <Typography variant="body1" gutterBottom>
                        {placeholder}
                    </Typography>
                    <StyledButton variant="text" onClick={handleSelectAll} disabled={disableSelectAll} right={100}>
                        {i18n.t("Select all")}
                    </StyledButton>
                    <StyledButton
                        variant="text"
                        onClick={handleClear}
                        disabled={isEmpty(selectedCategoriesWithSubcategories)}
                        right={30}
                    >
                        {i18n.t("Clear")}
                    </StyledButton>
                </Container>
                <TreeView
                    disableSelection
                    aria-label="Categories tree"
                    defaultCollapseIcon={<ArrowDropUpIcon />}
                    defaultExpandIcon={<ArrowDropDownIcon />}
                    style={{ maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
                >
                    {filteredCategories.map(category => (
                        <Node
                            key={category.value}
                            nodeId={category.value}
                            name={category.text}
                            selected={isAllCategorySelected(category.value)}
                            onSelectedChange={(nodeId: string, selected: boolean) =>
                                handleSelectedAllSubcategories(nodeId, selected, category.subcategories)
                            }
                            disabledSelection={category.disabledSelection}
                        >
                            {category.subcategories.map(({ value, text }) => (
                                <Leaf
                                    key={value}
                                    nodeId={value}
                                    parentId={category.value}
                                    name={text}
                                    selected={isSubcategorySelected(category.value, value)}
                                    onSelectedChange={handleSubcategoriesChange}
                                />
                            ))}
                        </Node>
                    ))}
                </TreeView>
            </div>
        );
    }
);

const Container = styled.div<{ $fullWidth?: boolean }>`
    position: relative;
    width: ${props => (props.$fullWidth ? "100%" : "unset")};
`;

const StyledButton = styled(Button)<{ right?: number }>`
    color: orange;
    text-transform: none;
    position: absolute;
    top: 0;
    right: ${props => props.right || 0}px;
    padding: 0px;
    font-weight: 400;
`;
