import React from "react";
import { InputAdornment, Menu, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import { isEmpty } from "lodash";

import i18n from "../../../../locales";
import { DropdownTextField } from "../../dropdown/DropdownTextField";
import { SelectedChip } from "../../selected-chip/SelectedChip";
import { CategoryOption, useCategorySelector } from "./useCategorySelector";
import { CategorySelectorList } from "./CategorySelectorList";
import { FullScreenDialog } from "../../dialog/FullScreenDialog";

interface CategorySelectorProps {
    categoryOptions: CategoryOption[];
    selectedCategoriesWithSubcategories?: Record<string, string[]>;
    onSelect: (value: Record<string, string[]> | undefined) => void;
    fullWidth?: boolean;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    fullScreen?: boolean;
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
        fullScreen = false,
    }: CategorySelectorProps) => {
        const categorySelectorState = useCategorySelector({
            categoryOptions,
            selectedCategoriesWithSubcategories,
            onSelect,
            disabled,
        });
        const {
            handleClick,
            categoriesSelection,
            handleDeleteCategoryFromSelection,
            expanded,
            anchorEl,
            handleClose,
            handleClear,
            containerWidth,
            isSmallScreen,
        } = categorySelectorState;
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
                        readOnly: isSmallScreen,
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
                {fullScreen ? (
                    <FullScreenDialog isOpen={Boolean(anchorEl)} onClose={handleClose} title={label}>
                        <CategorySelectorList
                            fullScreen={fullScreen}
                            placeholder={placeholder}
                            {...categorySelectorState}
                        />
                    </FullScreenDialog>
                ) : (
                    <StyledMenu
                        PaperProps={{ style: { width: containerWidth, padding: "16px" } }}
                        id="category-selector"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        onClose={handleClose}
                    >
                        <CategorySelectorList
                            fullScreen={fullScreen}
                            placeholder={placeholder}
                            {...categorySelectorState}
                        />
                    </StyledMenu>
                )}

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
