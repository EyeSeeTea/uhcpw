import { InputAdornment, Menu, Typography, Button } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import i18n from "../../../locales";
import { DropdownTextField } from "../dropdown/DropdownTextField";
import SearchInput from "../search-input/SearchInput";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { TreeView } from "@material-ui/lab";
import { Node } from "./Node";
import { Leaf } from "./Leaf";
import { ChildAndSubChildren } from "./ChildAndSubChildren";
import _ from "lodash";
import { SelectedChip } from "../selected-chip/SelectedChip";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

const EMPTY_IDS_ARRAY: string[] = [];

export type TreeOption = {
    id: string;
    name: string;
    code?: string;
    parents: { id: string; name: string }[];
    children?: { id: string; name: string; code: string }[];
};

interface TreeSelectorProps {
    items: TreeOption[];
    selectedIds?: string[];
    onSelectedIdsChange: (ids: string[]) => void;
    fullWidth?: boolean;
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
    showSubChildren?: boolean;
}

export const TreeSelector: React.FC<TreeSelectorProps> = React.memo(
    ({
        items,
        selectedIds = EMPTY_IDS_ARRAY,
        onSelectedIdsChange,
        fullWidth = false,
        placeholder,
        disabled = false,
        label,
        disabledItems,
        hasSelectAll = false,
        hasClearAll = false,
        topClearAll = 0,
        maxSelection,
        ariaLabel,
        disableSearch,
        showParentIfChecked,
        showSubChildren = false,
    }) => {
        const [expanded, setExpanded] = useState(false);
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const [searchTerm, setSearchTerm] = React.useState<string>("");
        const [expandedParents, setExpandedParents] = React.useState<string[]>(["all"]);

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
            setSearchTerm("");
        }, [expanded, setExpanded, setAnchorEl]);

        const filteredItemsBySearch: TreeOption[] = useMemo(() => {
            return items.reduce((acc, item) => {
                const filteredItemChildren =
                    item.children?.length && showSubChildren
                        ? item.children?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        : undefined;

                if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || filteredItemChildren?.length) {
                    return [
                        ...acc,
                        item.children?.length && showSubChildren
                            ? {
                                  ...item,
                                  children: filteredItemChildren,
                              }
                            : item,
                    ];
                }
                return acc;
            }, [] as TreeOption[]);
        }, [items, searchTerm, showSubChildren]);

        const handleSelectedAllItemsInParent = useCallback(
            (allItemsInSelectedParent: TreeOption[], selected: boolean) => {
                if (hasSelectAll) {
                    const allowedItemsInSelectedParent = allItemsInSelectedParent.filter(
                        ({ id }) => !disabledItems?.includes(id)
                    );

                    const subChildrenIds: string[] = allItemsInSelectedParent
                        .flatMap(item => (item.children ? item.children.map(child => child.id) : []))
                        .filter(id => !disabledItems?.includes(id));

                    const allSelectableItems = showSubChildren
                        ? [...subChildrenIds, ...allowedItemsInSelectedParent.map(({ id }) => id)]
                        : allowedItemsInSelectedParent.map(({ id }) => id);

                    const idsToSelect = selected
                        ? [...selectedIds, ...allSelectableItems.filter(id => !selectedIds.includes(id))]
                        : selectedIds.filter(id => !allSelectableItems.includes(id));

                    onSelectedIdsChange(idsToSelect);
                }
            },
            [hasSelectAll, showSubChildren, selectedIds, onSelectedIdsChange, disabledItems]
        );

        const handleSelectedChange = useCallback(
            (nodeId: string, selected: boolean) => {
                if (selected) {
                    const selection = [...selectedIds, nodeId];

                    if (onSelectedIdsChange) {
                        onSelectedIdsChange(selection);
                    }
                } else {
                    const isParent = items.find(item => item.parents.some(parent => parent.id === nodeId));

                    if (isParent) {
                        const finalChildren = filteredItemsBySearch.filter(item =>
                            item.parents.some(p => p.id === nodeId)
                        );
                        handleSelectedAllItemsInParent(finalChildren, selected);
                    } else {
                        const selection = selectedIds.filter(id => id !== nodeId);

                        if (onSelectedIdsChange) {
                            onSelectedIdsChange(selection);
                        }
                    }
                }
            },
            [selectedIds, onSelectedIdsChange, items, filteredItemsBySearch, handleSelectedAllItemsInParent]
        );

        const selectedItems = useMemo(() => {
            const selectedSubChildren = showSubChildren
                ? items
                      .flatMap(item => (item.children ? item.children : []))
                      .filter(item => selectedIds.includes(item.id))
                : [];
            return [...items.filter(item => selectedIds.includes(item.id)), ...selectedSubChildren];
        }, [items, selectedIds, showSubChildren]);

        const handleSearchChange = useCallback(
            (term: string) => {
                if (term) {
                    const parentsToExpand: string[] = [];
                    const filterItems = items.filter(item => item.name.toLowerCase().includes(term.toLowerCase()));
                    const filterParents = _.uniqBy(filterItems.map(item => item.parents).flat(), "id");
                    filterParents.forEach(({ id }) => {
                        const finalChildren = filterItems.filter(item => item.parents.some(parent => parent.id === id));
                        if (finalChildren.length) parentsToExpand.push(id);
                    });
                    setExpandedParents(parentsToExpand);
                }
                setSearchTerm(term);
            },
            [items, setSearchTerm, setExpandedParents]
        );

        const parents = useMemo(() => {
            return _.uniqBy(filteredItemsBySearch.map(item => item.parents).flat(), "id").map(parent => ({
                ...parent,
                isLeaf: false,
            }));
        }, [filteredItemsBySearch]);

        const filteredItemsBySearchWithoutParent = useMemo(() => {
            return filteredItemsBySearch.filter(item => !item.parents.length).map(item => ({ ...item, isLeaf: true }));
        }, [filteredItemsBySearch]);

        const handleToggle = useCallback((_event: React.ChangeEvent<{}>, nodeIds: string[]) => {
            setExpandedParents(nodeIds);
        }, []);

        const handleClear = useCallback(() => {
            hasClearAll && onSelectedIdsChange([]);
        }, [hasClearAll, onSelectedIdsChange]);

        const isAllItemParentSelected = useCallback(
            (itemParentId: string) => {
                if (hasSelectAll) {
                    const finalChildrenAllowed = filteredItemsBySearch
                        .filter(item => item.parents.some(p => p.id === itemParentId))
                        .filter(({ id }) => !disabledItems?.includes(id));

                    const finalSubChildrenAllowed = showSubChildren
                        ? filteredItemsBySearch
                              .flatMap(item => (item.children ? item.children : []))
                              .filter(({ id }) => !disabledItems?.includes(id))
                        : [];

                    const allowedSelection = showSubChildren
                        ? [...finalSubChildrenAllowed, ...finalChildrenAllowed]
                        : finalChildrenAllowed;

                    return !!allowedSelection.length && allowedSelection.every(item => selectedIds.includes(item.id));
                }
            },
            [hasSelectAll, filteredItemsBySearch, showSubChildren, disabledItems, selectedIds]
        );

        const isItemParentDisabled = useCallback(
            (allItemsInSelectedParent: TreeOption[]) => {
                const finalChildrenAllowed = allItemsInSelectedParent.filter(({ id }) => !disabledItems?.includes(id));
                return (
                    (hasSelectAll && !finalChildrenAllowed.length) ||
                    (!!maxSelection && maxSelection < finalChildrenAllowed.length)
                );
            },
            [disabledItems, hasSelectAll, maxSelection]
        );

        const areAllItemsSelected = useMemo(() => {
            const selection = filteredItemsBySearch.filter(
                ({ id }) => !selectedIds?.includes(id) && !disabledItems?.includes(id)
            );
            const selectedSubChildren = showSubChildren
                ? filteredItemsBySearch
                      .flatMap(item => (item.children ? item.children : []))
                      .filter(({ id }) => !selectedIds?.includes(id) && !disabledItems?.includes(id))
                : [];
            return [...selection, ...selectedSubChildren]?.length === 0;
        }, [disabledItems, filteredItemsBySearch, selectedIds, showSubChildren]);

        const itemsToSelect = useMemo(() => {
            const selectableItems = filteredItemsBySearch
                .filter(({ id }) => !selectedIds?.includes(id) && !disabledItems?.includes(id))
                .map(({ id }) => id);
            const selectableSubChildren = showSubChildren
                ? filteredItemsBySearch
                      .flatMap(item => (item.children ? item.children : []))
                      .filter(({ id }) => !selectedIds?.includes(id) && !disabledItems?.includes(id))
                      .map(({ id }) => id)
                : [];
            return [...selectableItems, ...selectableSubChildren];
        }, [disabledItems, filteredItemsBySearch, selectedIds, showSubChildren]);

        const handleSelectAll = useCallback(() => {
            if (hasSelectAll) {
                onSelectedIdsChange(itemsToSelect);
            }
        }, [itemsToSelect, hasSelectAll, onSelectedIdsChange]);

        const selectedChips = useMemo(() => {
            const selectedDataToShow =
                showParentIfChecked && areAllItemsSelected && parents.length > 0 ? parents : selectedItems;
            return selectedDataToShow.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                return 0;
            });
        }, [areAllItemsSelected, parents, selectedItems, showParentIfChecked]);

        const finalPlaceholder = useMemo(() => {
            return selectedChips.length === 0 ? placeholder : "";
        }, [placeholder, selectedChips.length]);

        return (
            <Container $fullWidth={fullWidth}>
                <StyledDropdownTextField
                    label={label}
                    aria-label={ariaLabel || placeholder || "Tree selector"}
                    onClick={handleClick}
                    placeholder={finalPlaceholder}
                    role={"textbox"}
                    fullWidth={fullWidth}
                    value={""}
                    disabled={disabled}
                    $isDisabled={disabled}
                    inputProps={{
                        "aria-label": `input ${ariaLabel || placeholder || "Tree selector"}`,
                    }}
                    InputProps={{
                        startAdornment: (
                            <SelectedContainer>
                                {selectedChips.map(item => {
                                    return (
                                        <SelectedChip
                                            key={item.id}
                                            label={item.name}
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
                                aria-label="expand"
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
                <StyledMenu
                    PaperProps={{ style: { width: "600px", padding: "16px" } }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    onClose={handleClose}
                >
                    <div role="listbox">
                        {!disableSearch && (
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
                        )}

                        <br />
                        <Container $fullWidth={fullWidth}>
                            <Typography variant="body1" gutterBottom>
                                {placeholder}
                            </Typography>
                            {hasSelectAll && (
                                <StyledButton
                                    variant="text"
                                    onClick={handleSelectAll}
                                    disabled={
                                        areAllItemsSelected || (!!maxSelection && maxSelection < itemsToSelect.length)
                                    }
                                    right={100}
                                >
                                    {i18n.t("Select all")}
                                </StyledButton>
                            )}
                            {hasClearAll && (
                                <StyledButton
                                    variant="text"
                                    onClick={handleClear}
                                    disabled={(selectedIds || []).length === 0}
                                    right={30}
                                >
                                    {i18n.t("Clear")}
                                </StyledButton>
                            )}
                        </Container>
                        <TreeView
                            disableSelection
                            defaultCollapseIcon={<ArrowDropUpIcon aria-label="collapse-icon" />}
                            defaultExpandIcon={<ArrowDropDownIcon aria-label="expand-icon" />}
                            onNodeToggle={handleToggle}
                            expanded={expandedParents}
                            style={{ maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
                        >
                            {[...filteredItemsBySearchWithoutParent, ...parents].map((option, nindex) => {
                                if (option.isLeaf) {
                                    const selectedOption = selectedIds.includes(option.id);
                                    return (
                                        <FirstLevelLeafWrapper>
                                            <Leaf
                                                key={`first-level-${nindex}`}
                                                nodeId={option.id}
                                                name={option.name}
                                                selected={selectedOption}
                                                onSelectedChange={handleSelectedChange}
                                                disabled={
                                                    disabledItems?.includes(option.id) ||
                                                    (!selectedOption &&
                                                        !!maxSelection &&
                                                        maxSelection === selectedIds.length)
                                                }
                                            />
                                        </FirstLevelLeafWrapper>
                                    );
                                }

                                const finalChildren = filteredItemsBySearch.filter(item =>
                                    item.parents.some(p => p.id === option.id)
                                );
                                const children = items.filter(item => item.parents.some(p => p.id === option.id));
                                const selectedCount = children.filter(child => selectedIds.includes(child.id)).length;

                                return (
                                    <div key={`first-level-${nindex}`}>
                                        <Node
                                            nodeId={option.id}
                                            name={option.name}
                                            selectedCount={selectedCount}
                                            onSelectedChange={(_nodeId: string, selected: boolean) =>
                                                handleSelectedAllItemsInParent(finalChildren, selected)
                                            }
                                            selected={isAllItemParentSelected(option.id)}
                                            disabled={isItemParentDisabled(finalChildren)}
                                            hasSelectAll={hasSelectAll}
                                        >
                                            {finalChildren.map((child, lindex) => {
                                                const selected = selectedIds.includes(child.id);
                                                return showSubChildren && child?.children?.length ? (
                                                    <ChildAndSubChildren
                                                        nodeId={child.id}
                                                        name={child.name}
                                                        selected={selected}
                                                        onSelectedChange={handleSelectedChange}
                                                        disabled={
                                                            disabledItems?.includes(child.id) ||
                                                            (!selected &&
                                                                !!maxSelection &&
                                                                maxSelection === selectedIds.length)
                                                        }
                                                        subChildren={child?.children}
                                                        disabledItems={disabledItems}
                                                        selectedIds={selectedIds}
                                                        maxSelection={maxSelection}
                                                    />
                                                ) : (
                                                    <Leaf
                                                        key={`second-level-${option.id}-${lindex}`}
                                                        nodeId={child.id}
                                                        name={child.name}
                                                        selected={selected}
                                                        onSelectedChange={handleSelectedChange}
                                                        disabled={
                                                            disabledItems?.includes(child.id) ||
                                                            (!selected &&
                                                                !!maxSelection &&
                                                                maxSelection === selectedIds.length)
                                                        }
                                                    />
                                                );
                                            })}
                                        </Node>
                                    </div>
                                );
                            })}
                        </TreeView>
                    </div>
                </StyledMenu>
                {(selectedIds || []).length > 0 && hasClearAll && (
                    <StyledButton
                        variant="text"
                        onClick={handleClear}
                        disabled={disabled}
                        top={topClearAll}
                        right={-15}
                    >
                        {i18n.t("Clear")}
                    </StyledButton>
                )}
            </Container>
        );
    }
);

const Container = styled.div<{ $fullWidth: boolean }>`
    position: relative;
    width: ${props => (props.$fullWidth ? "100%" : "unset")};
`;

const StyledButton = styled(Button)<{ top?: number; right?: number }>`
    color: orange;
    text-transform: none;
    position: absolute;
    top: ${props => props.top || 0}px;
    right: ${props => props.right || 0}px;
    padding: 0px;
    font-weight: 400;
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

const FirstLevelLeafWrapper = styled.div`
    .MuiTreeItem-label {
        padding: 8px;
    }
`;
