import React, { useCallback, useMemo, useState } from "react";
import { InputAdornment, Menu, Typography, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CloseIcon from "@material-ui/icons/Close";
import { TreeView } from "@material-ui/lab";
import styled from "styled-components";
import { isEmpty } from "lodash";

import i18n from "../../../../locales";
import { CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION } from "../../../pages/policy-explorer/usePolicyExplorer";
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
    description: string;
};

interface CategorySelectorProps {
    categoryOptions: CategoryOption[];
    selectedCategoriesWithSubcategories?: Record<string, string[]>;
    disabledCategories: string[];
    onSelect: (value: Record<string, string[]> | undefined) => void;
    fullWidth?: boolean;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    moreThanOneCountrySelected?: boolean;
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
        disabledCategories,
        moreThanOneCountrySelected = false,
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
                return (
                    (!!selectedCategoryOption?.subcategories.length &&
                        selectedCategoryOption?.subcategories.every(
                            subcategory =>
                                !!selectedCategoriesWithSubcategories &&
                                selectedCategoriesWithSubcategories[categoryId]?.includes(subcategory.value)
                        )) ||
                    (!selectedCategoryOption?.subcategories.length &&
                        !!selectedCategoriesWithSubcategories &&
                        !!selectedCategoriesWithSubcategories[categoryId])
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
                    subcategories: CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION.includes(category.value)
                        ? category.subcategories
                        : category.subcategories.filter(subcategory =>
                              subcategory.text.toLowerCase().includes(searchTerm.toLowerCase())
                          ),
                }))
                .filter(
                    ({ value, text, subcategories }) =>
                        (subcategories.length && !CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION.includes(value)) ||
                        text.toLowerCase().includes(searchTerm.toLowerCase())
                );
        }, [categoryOptions, searchTerm]);

        const handleClear = useCallback(() => {
            onSelect && onSelect(undefined);
        }, [onSelect]);

        const handleSelectAll = useCallback(() => {
            const categoriesToSelect = filteredCategories.reduce((accCategoriesToSelect, category) => {
                if (!disabledCategories.includes(category.value)) {
                    return {
                        ...accCategoriesToSelect,
                        [category.value]: category.subcategories.map(({ value }) => value),
                    };
                }
                return accCategoriesToSelect;
            }, {});

            !isEmpty(categoriesToSelect) && onSelect && onSelect(categoriesToSelect);
        }, [disabledCategories, filteredCategories, onSelect]);

        const disableSelectAll = useMemo(() => {
            const categoriesToBeSelected = filteredCategories.filter(
                ({ value }) =>
                    !disabledCategories.includes(value) &&
                    ((!!selectedCategoriesWithSubcategories &&
                        !Object.keys(selectedCategoriesWithSubcategories).includes(value)) ||
                        isEmpty(selectedCategoriesWithSubcategories))
            );

            const normalCategories = filteredCategories.filter(
                category =>
                    !CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION.includes(category.value) &&
                    !disabledCategories.includes(category.value)
            );

            const specialCategories = filteredCategories.filter(
                category =>
                    CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION.includes(category.value) &&
                    !disabledCategories.includes(category.value)
            );

            const bothTypesOfCategoriesCanbeSelected = normalCategories.length && specialCategories.length;
            return (
                (moreThanOneCountrySelected && !!bothTypesOfCategoriesCanbeSelected) ||
                categoriesToBeSelected.length === 0
            );
        }, [disabledCategories, filteredCategories, moreThanOneCountrySelected, selectedCategoriesWithSubcategories]);

        return (
            <Container $fullWidth={fullWidth}>
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
                        <Container>
                            <Typography variant="body1" gutterBottom>
                                {placeholder}
                            </Typography>
                            <StyledButton
                                variant="text"
                                onClick={handleSelectAll}
                                disabled={disableSelectAll}
                                right={100}
                            >
                                {i18n.t("Select all")}
                            </StyledButton>
                            <StyledButton
                                variant="text"
                                onClick={handleClear}
                                disabled={isEmpty(selectedCategoriesWithSubcategories)}
                                right={30}
                            >
                                {i18n.t("Clear all")}
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
                                    disabled={disabledCategories.includes(category.value)}
                                >
                                    {category.subcategories.map(({ value, text }) => (
                                        <Leaf
                                            key={value}
                                            nodeId={value}
                                            parentId={category.value}
                                            name={text}
                                            selected={isSubcategorySelected(category.value, value)}
                                            onSelectedChange={handleSubcategoriesChange}
                                            disabled={disabledCategories.includes(category.value)}
                                        />
                                    ))}
                                </Node>
                            ))}
                        </TreeView>
                    </div>
                </StyledMenu>
                {!isEmpty(selectedCategoriesWithSubcategories) && (
                    <StyledButton variant="text" onClick={handleClear} disabled={disabled}>
                        {i18n.t("Clear all")}
                    </StyledButton>
                )}
            </Container>
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
