import React, { useCallback, useMemo, useState } from "react";
import { InputAdornment, Menu, Typography, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CloseIcon from "@material-ui/icons/Close";
import { TreeView } from "@material-ui/lab";
import styled from "styled-components";
import { isEmpty } from "lodash";

import i18n from "../../../../locales";
import {
    CATEGORIES_WITHOUT_SUBCATEGORIES,
    COMBINED_POLICY_TABLES_CATEGORY_ID,
} from "../../../pages/policy-explorer/usePolicyExplorer";
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
    disabledSelection?: boolean;
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
            (categoryId: string, subcategoryId?: string) => {
                if (selectedCategoriesWithSubcategories) {
                    const { [categoryId]: subcategories, ...maybeNewSelection } = selectedCategoriesWithSubcategories;
                    if (categoryId === COMBINED_POLICY_TABLES_CATEGORY_ID && subcategoryId) {
                        const restSubcategories = subcategories?.filter(id => id !== subcategoryId);
                        const isCategoryDeleted = !restSubcategories?.length;
                        const newSelection = isCategoryDeleted
                            ? { ...maybeNewSelection }
                            : { ...maybeNewSelection, [categoryId]: restSubcategories };
                        onSelect && onSelect(Object.keys(newSelection)?.length ? newSelection : undefined);
                    }
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
                    handleDeleteCategoryFromSelection(parentCategoryId, subcategoryId);
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
                    subcategories: CATEGORIES_WITHOUT_SUBCATEGORIES.includes(category.value)
                        ? category.subcategories
                        : category.subcategories.filter(subcategory =>
                              subcategory.text.toLowerCase().includes(searchTerm.toLowerCase())
                          ),
                }))
                .filter(
                    ({ value, text, subcategories }) =>
                        (subcategories.length && !CATEGORIES_WITHOUT_SUBCATEGORIES.includes(value)) ||
                        text.toLowerCase().includes(searchTerm.toLowerCase())
                );
        }, [categoryOptions, searchTerm]);

        const handleClear = useCallback(() => {
            onSelect && onSelect(undefined);
        }, [onSelect]);

        const handleSelectAll = useCallback(() => {
            const categoriesToSelect = filteredCategories.reduce((accCategoriesToSelect, category) => {
                return {
                    ...accCategoriesToSelect,
                    [category.value]: category.subcategories.map(({ value }) => value),
                };
            }, {});

            if (!isEmpty(filteredCategories) && onSelect) {
                onSelect(categoriesToSelect);
            }
        }, [filteredCategories, onSelect]);

        const disableSelectAll = useMemo(() => {
            const categoriesToBeSelected = filteredCategories.filter(category => {
                const categoryNotSelected =
                    !!selectedCategoriesWithSubcategories &&
                    !Object.keys(selectedCategoriesWithSubcategories).includes(category.value);

                const allSubcategoriesNotSelected =
                    !!selectedCategoriesWithSubcategories &&
                    selectedCategoriesWithSubcategories[category.value]?.length !== category.subcategories.length;

                return (
                    isEmpty(selectedCategoriesWithSubcategories) || categoryNotSelected || allSubcategoriesNotSelected
                );
            });

            return categoriesToBeSelected.length === 0;
        }, [filteredCategories, selectedCategoriesWithSubcategories]);

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
                                    ? categoriesSelection.map(selectedCategory => {
                                          if (selectedCategory.value === COMBINED_POLICY_TABLES_CATEGORY_ID) {
                                              return selectedCategory.subcategories.map(subcategory => (
                                                  <SelectedChip
                                                      key={subcategory.value}
                                                      label={subcategory.text}
                                                      onDelete={() =>
                                                          handleDeleteCategoryFromSelection(
                                                              selectedCategory.value,
                                                              subcategory.value
                                                          )
                                                      }
                                                      deleteIcon={<CloseIcon fontSize="small" />}
                                                  />
                                              ));
                                          } else {
                                              return (
                                                  <SelectedChip
                                                      key={selectedCategory.value}
                                                      label={selectedCategory.text}
                                                      onDelete={() =>
                                                          handleDeleteCategoryFromSelection(selectedCategory.value)
                                                      }
                                                      deleteIcon={<CloseIcon fontSize="small" />}
                                                  />
                                              );
                                          }
                                      })
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
                </StyledMenu>
                {!isEmpty(selectedCategoriesWithSubcategories) && (
                    <StyledButton variant="text" onClick={handleClear} disabled={disabled} right={-15}>
                        {i18n.t("Clear")}
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
