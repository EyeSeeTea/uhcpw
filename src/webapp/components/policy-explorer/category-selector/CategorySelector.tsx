import React, { useCallback, useMemo, useState } from "react";
import { InputAdornment, Menu, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CloseIcon from "@material-ui/icons/Close";
import { TreeView } from "@material-ui/lab";
import styled from "styled-components";

import { DropdownTextField } from "../../dropdown/DropdownTextField";
import SearchInput from "../../search-input/SearchInput";
import { Node } from "./Node";
import { Leaf } from "./Leaf";
import { SelectedChip } from "../../selected-chip/SelectedChip";

type SubcategoryOption = {
    value: string;
    text: string;
};

export type CategoryOption = {
    value: string;
    text: string;
    subcategories: SubcategoryOption[];
};

interface CategorySelectorProps {
    categoryOptions: CategoryOption[];
    selectedCategoriesWithSubcategories?: Record<string, string[]>;
    onSelect: (value: Record<string, string[]> | undefined) => void;
    fullWidth?: boolean;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
}

export const CategorySelector = React.memo(
    ({
        categoryOptions,
        selectedCategoriesWithSubcategories,
        onSelect,
        fullWidth = false,
        placeholder = "",
        disabled = false,
        label = "",
    }: CategorySelectorProps) => {
        const [expanded, setExpanded] = useState(false);
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const [searchTerm, setSearchTerm] = React.useState<string>("");

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLInputElement>) => {
                if (disabled !== true) {
                    setAnchorEl(event.currentTarget);
                    setExpanded(!expanded);
                }
            },
            [disabled, expanded]
        );

        const handleClose = useCallback(() => {
            setAnchorEl(null);
            setExpanded(!expanded);
        }, [expanded, setExpanded, setAnchorEl]);

        const handleSearchChange = useCallback(
            (term: string) => {
                setSearchTerm(term);
            },
            [setSearchTerm]
        );

        const handleDeleteCategoryFromSelection = useCallback(
            (categoryId: string) => {
                if (selectedCategoriesWithSubcategories) {
                    const { [categoryId]: _deleted, ...newSelection } = selectedCategoriesWithSubcategories;
                    onSelect && onSelect(Object.keys(newSelection)?.length ? newSelection : undefined);
                }
            },
            [onSelect, selectedCategoriesWithSubcategories]
        );

        const handleSelectedAllSubcategories = useCallback(
            (categoryId: string, selected: boolean, subcategories: SubcategoryOption[]) => {
                if (selected) {
                    onSelect &&
                        onSelect({
                            ...selectedCategoriesWithSubcategories,
                            [categoryId]: subcategories.map(({ value }) => value),
                        });
                } else {
                    handleDeleteCategoryFromSelection(categoryId);
                }
            },
            [handleDeleteCategoryFromSelection, onSelect, selectedCategoriesWithSubcategories]
        );

        const handleSubcategoriesChange = useCallback(
            (parentCategoryId: string, subcategoryId: string, selected: boolean) => {
                const currentSubcategories =
                    (selectedCategoriesWithSubcategories && selectedCategoriesWithSubcategories[parentCategoryId]) ||
                    [];
                const newSubcategories = selected
                    ? [...currentSubcategories, subcategoryId]
                    : currentSubcategories.filter(id => id !== subcategoryId);

                if (newSubcategories.length) {
                    onSelect &&
                        onSelect({ ...selectedCategoriesWithSubcategories, [parentCategoryId]: newSubcategories });
                } else {
                    handleDeleteCategoryFromSelection(parentCategoryId);
                }
            },
            [handleDeleteCategoryFromSelection, onSelect, selectedCategoriesWithSubcategories]
        );

        const isAllCategorySelected = useCallback(
            (categoryId: string) => {
                const selectedCategoryOption = categoryOptions.find(({ value }) => value === categoryId);
                return selectedCategoryOption?.subcategories.every(
                    ({ value }) =>
                        !!selectedCategoriesWithSubcategories &&
                        selectedCategoriesWithSubcategories[categoryId]?.includes(value)
                );
            },
            [categoryOptions, selectedCategoriesWithSubcategories]
        );

        const isSubcategorySelected = useCallback(
            (categoryId: string, subcategoryId: string) => {
                return !!(
                    selectedCategoriesWithSubcategories &&
                    selectedCategoriesWithSubcategories[categoryId]?.includes(subcategoryId)
                );
            },
            [selectedCategoriesWithSubcategories]
        );

        const categoriesSelection = useMemo(
            () =>
                categoryOptions
                    .filter(
                        ({ value }) =>
                            !!selectedCategoriesWithSubcategories &&
                            Object.keys(selectedCategoriesWithSubcategories).includes(value)
                    )
                    .map(category => ({
                        ...category,
                        subcategories: category.subcategories.filter(
                            ({ value }) =>
                                !!selectedCategoriesWithSubcategories &&
                                selectedCategoriesWithSubcategories[category.value]?.includes(value)
                        ),
                    })),
            [categoryOptions, selectedCategoriesWithSubcategories]
        );

        const filteredCategories = useMemo(() => {
            return categoryOptions
                .map(category => ({
                    ...category,
                    subcategories: category.subcategories.filter(subcategory =>
                        subcategory.text.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                }))
                .filter(
                    ({ text, subcategories }) =>
                        subcategories.length || text.toLowerCase().includes(searchTerm.toLowerCase())
                );
        }, [categoryOptions, searchTerm]);

        return (
            <>
                <StyledDropdownTextField
                    label={label}
                    onClick={handleClick}
                    aria-label="Categories"
                    role={"textbox"}
                    disabled
                    fullWidth={fullWidth}
                    InputProps={{
                        startAdornment: (
                            <SelectedContainer>
                                {categoriesSelection?.length
                                    ? categoriesSelection.map(selectedCategory => (
                                          <SelectedChip
                                              key={selectedCategory.value}
                                              label={selectedCategory.text}
                                              onDelete={() => handleDeleteCategoryFromSelection(selectedCategory.value)}
                                              deleteIcon={<CloseIcon fontSize="small" />}
                                          />
                                      ))
                                    : placeholder}
                            </SelectedContainer>
                        ),
                        endAdornment: (
                            <InputAdornment
                                position="start"
                                style={{ top: "calc(50% - 14px)", right: 0, position: "absolute", height: " 24px" }}
                            >
                                {expanded ? (
                                    <ArrowDropUpIcon htmlColor="black" style={{ cursor: "pointer" }} />
                                ) : (
                                    <ArrowDropDownIcon htmlColor="black" style={{ cursor: "pointer" }} />
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
                <StyledMenu
                    PaperProps={{ style: { width: "600px", padding: "16px" } }}
                    id="category-selector"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    onClose={handleClose}
                >
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
                        <Typography variant="body1" gutterBottom>
                            {placeholder}
                        </Typography>
                        <TreeView
                            disableSelection
                            aria-label="Categories tree"
                            defaultCollapseIcon={<ArrowDropUpIcon />}
                            defaultExpandIcon={<ArrowDropDownIcon />}
                            style={{ maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
                        >
                            {filteredCategories.map(category => (
                                <Node key={category.value} nodeId={`main_${category.value}`} name={category.text}>
                                    <Node
                                        nodeId={category.value}
                                        name={category.text}
                                        selected={isAllCategorySelected(category.value)}
                                        onSelectedChange={(nodeId: string, selected: boolean) =>
                                            handleSelectedAllSubcategories(nodeId, selected, category.subcategories)
                                        }
                                        isSelectable
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
                                </Node>
                            ))}
                        </TreeView>
                    </div>
                </StyledMenu>
            </>
        );
    }
);

const SelectedContainer = styled.div`
    width: 100%;
`;

const StyledMenu = styled(Menu)`
    .MuiInputBase-root {
        border-radius: 20px;
    }
`;

const StyledDropdownTextField = styled(DropdownTextField)`
    div.MuiInputBase-root {
        border-radius: 20px;
    }
`;
