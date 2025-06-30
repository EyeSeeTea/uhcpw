import { InputAdornment, Menu, Button } from "@material-ui/core";
import React from "react";
import { DropdownTextField } from "../dropdown/DropdownTextField";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

import i18n from "../../../locales";
import { SelectedChip } from "../selected-chip/SelectedChip";
import { TreeSelectorList } from "./TreeSelectorList";
import { ALL_NODE_ID, useTreeSelector } from "./useTreeSelector";
import { FullScreenDialog } from "../dialog/FullScreenDialog";

const EMPTY_IDS_ARRAY: string[] = [];

export type TreeOption = {
    id: string;
    name: string;
    code?: string;
    parents: { id: string; name: string }[];
    children?: TreeOption[];
    isLeaf?: boolean;
};

interface TreeSelectorProps {
    items: TreeOption[];
    selectedIds?: string[];
    onSelectedIdsChange: (ids: string[]) => void;
    fullWidth?: boolean;
    fullScreen?: boolean;
    minWidth?: string;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    disabledItems?: string[];
    hasSelectAll?: boolean;
    hasClearAll?: boolean;
    topClearAll?: number;
    maxSelection?: number;
    ariaLabel?: string;
    disableSearch?: boolean;
    showParentIfChecked?: boolean;
    showOnlyAllParentSelectedIfChecked?: boolean;
    allSelectedLabel?: string;
    showSubChildren?: boolean;
    defaultExpanded?: string[];
    selectedItemsToShowWhenAllSelected?: string[];
    parentSort?: (a: string, b: string) => number;
}

export const TreeSelector: React.FC<TreeSelectorProps> = React.memo(props => {
    const {
        items,
        selectedIds = EMPTY_IDS_ARRAY,
        fullWidth = false,
        fullScreen = false,
        minWidth,
        placeholder,
        disabled = false,
        label,
        hasClearAll = false,
        topClearAll = 0,
        maxSelection,
        ariaLabel,
        allSelectedLabel,
        disabledItems = EMPTY_IDS_ARRAY,
        hasSelectAll = false,
        disableSearch = false,
        showSubChildren = false,
    } = props;

    const useTreeSelectorState = useTreeSelector(props);
    const {
        handleClick,
        finalPlaceholder,
        selectedChips,
        handleSelectedChange,
        expanded,
        handleClose,
        handleClear,
        anchorEl,
        containerWidth,
        isSmallScreen,
    } = useTreeSelectorState;

    return (
        <Container $fullWidth={fullWidth}>
            <StyledDropdownTextField
                id="tree-selector-input"
                label={label}
                aria-label={ariaLabel || placeholder || "Tree selector"}
                onClick={handleClick}
                placeholder={finalPlaceholder}
                role="textbox"
                aria-haspopup="listbox"
                aria-controls="tree-selector-menu"
                fullWidth={fullWidth}
                minWidth={minWidth}
                value={""}
                disabled={disabled}
                $isDisabled={disabled}
                inputProps={{
                    "aria-label": `input ${ariaLabel || placeholder || "Tree selector"}`,
                }}
                InputProps={{
                    readOnly: isSmallScreen,
                    startAdornment: (
                        <SelectedContainer>
                            {selectedChips.map(item => {
                                return (
                                    <SelectedChip
                                        key={item.id}
                                        label={
                                            item.id === ALL_NODE_ID && allSelectedLabel ? allSelectedLabel : item.name
                                        }
                                        onDelete={() => handleSelectedChange(item.id, false)}
                                        deleteIcon={<CloseIcon fontSize="small" />}
                                    />
                                );
                            })}
                        </SelectedContainer>
                    ),
                    endAdornment: (
                        <InputAdornment
                            position="start"
                            aria-label={`expand-tree-${ariaLabel || placeholder || "icon"}`}
                            style={{
                                top: "calc(50% - 14px)",
                                right: 0,
                                position: "absolute",
                                height: "24px",
                            }}
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
                    <TreeSelectorList
                        disabledItems={disabledItems}
                        hasSelectAll={hasSelectAll}
                        maxSelection={maxSelection}
                        disableSearch={disableSearch}
                        showSubChildren={showSubChildren}
                        items={items}
                        selectedIds={selectedIds}
                        fullWidth={fullWidth}
                        fullScreen={fullScreen}
                        placeholder={placeholder}
                        hasClearAll={hasClearAll}
                        {...useTreeSelectorState}
                    />
                </FullScreenDialog>
            ) : (
                <StyledMenu
                    id="tree-selector-menu"
                    PaperProps={{ style: { width: containerWidth, padding: "16px" } }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    onClose={handleClose}
                    role="listbox"
                    aria-labelledby="tree-selector-input"
                >
                    <TreeSelectorList
                        disabledItems={disabledItems}
                        hasSelectAll={hasSelectAll}
                        maxSelection={maxSelection}
                        disableSearch={disableSearch}
                        showSubChildren={showSubChildren}
                        items={items}
                        selectedIds={selectedIds}
                        fullWidth={fullWidth}
                        fullScreen={fullScreen}
                        placeholder={placeholder}
                        hasClearAll={hasClearAll}
                        {...useTreeSelectorState}
                    />
                </StyledMenu>
            )}

            {(selectedIds || []).length > 0 && hasClearAll && (
                <StyledButtonClear
                    variant="text"
                    onClick={handleClear}
                    disabled={disabled}
                    top={topClearAll}
                    right={-15}
                    className="TreeSelector-clear-button"
                >
                    {i18n.t("Clear")}
                </StyledButtonClear>
            )}
        </Container>
    );
});

const Container = styled.div<{ $fullWidth: boolean }>`
    position: relative;
    width: ${props => (props.$fullWidth ? "100%" : "unset")};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
    color: orange;
    text-transform: none;
    padding: 0px;
    font-weight: 400;
`;

const StyledButtonClear = styled(StyledButton)<{ top?: number; right?: number }>`
    position: absolute;
    top: ${props => props.top}px;
    right: ${props => props.right}px;
`;

const SelectedContainer = styled.div`
    max-width: 100%;
    display: flow-root;
`;

const StyledMenu = styled(Menu)`
    .MuiInputBase-root {
        border-radius: 20px;
    }
`;

const StyledDropdownTextField = styled(DropdownTextField)`
    .MuiInputBase-root {
        border-radius: 20px !important;
        color: black;
    }
    .MuiInputBase-input {
        caret-color: transparent;
    }
`;
