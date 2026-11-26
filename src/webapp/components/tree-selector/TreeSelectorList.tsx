import React from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { TreeView } from "@material-ui/lab";
import styled from "styled-components";

import SearchInput from "../search-input/SearchInput";
import { SelectionListHeader } from "../selection-list-header/SelectionListHeader";
import { Node } from "./Node";
import { Leaf } from "./Leaf";
import { ChildAndSubChildren } from "./ChildAndSubChildren";
import { TreeOption } from "./TreeSelector";

interface TreeSelectorListProps {
    items: TreeOption[];
    selectedIds: string[];
    fullScreen: boolean;
    fullWidth: boolean;
    placeholder?: string;
    disabledItems: string[];
    hasSelectAll: boolean;
    hasClearAll: boolean;
    maxSelection?: number;
    disableSearch: boolean;
    showSubChildren: boolean;
    searchTerm: string;
    handleSearchChange: (term: string) => void;
    isSmallScreen: boolean;
    handleSelectAll: () => void;
    areAllItemsSelected: boolean;
    itemsToSelect: string[];
    handleClear: () => void;
    handleToggle: (_event: React.ChangeEvent<{}>, nodeIds: string[]) => void;
    expandedParents: string[];
    filteredItemsBySearchWithoutParent: TreeOption[];
    parents: {
        isLeaf: boolean;
        id: string;
        name: string;
    }[];
    handleSelectedChange: (nodeId: string, selected: boolean) => void;
    filteredItemsBySearch: TreeOption[];
    handleSelectedAllItemsInParent: (allItemsInSelectedParent: TreeOption[], selected: boolean) => void;
    isAllItemParentSelected: (itemParentId: string) => boolean | undefined;
    isItemParentDisabled: (allItemsInSelectedParent: TreeOption[]) => boolean;
}

export const TreeSelectorList: React.FC<TreeSelectorListProps> = React.memo(props => {
    const {
        items,
        selectedIds,
        fullScreen,
        fullWidth,
        placeholder,
        disabledItems,
        hasSelectAll,
        hasClearAll,
        maxSelection,
        disableSearch,
        showSubChildren,
        searchTerm,
        handleSearchChange,
        isSmallScreen,
        handleSelectAll,
        areAllItemsSelected,
        itemsToSelect,
        handleClear,
        handleToggle,
        expandedParents,
        filteredItemsBySearchWithoutParent,
        parents,
        handleSelectedChange,
        filteredItemsBySearch,
        handleSelectedAllItemsInParent,
        isAllItemParentSelected,
        isItemParentDisabled,
    } = props;

    return (
        <div role="listbox">
            {!disableSearch && (
                <>
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
                </>
            )}

            <HeaderContainer $fullWidth={fullWidth} $hasSearch={!disableSearch}>
                <SelectionListHeader
                    title={placeholder}
                    selectAll={
                        hasSelectAll
                            ? {
                                  onClick: handleSelectAll,
                                  disabled:
                                      areAllItemsSelected || (!!maxSelection && maxSelection < itemsToSelect.length),
                              }
                            : undefined
                    }
                    clear={
                        hasClearAll ? { onClick: handleClear, disabled: (selectedIds || []).length === 0 } : undefined
                    }
                    isSmallScreen={isSmallScreen}
                />
            </HeaderContainer>
            <TreeView
                disableSelection
                defaultCollapseIcon={<ArrowDropUpIcon aria-label="collapse-icon" />}
                defaultExpandIcon={<ArrowDropDownIcon aria-label="expand-icon" />}
                onNodeToggle={handleToggle}
                expanded={expandedParents}
                style={fullScreen ? {} : { maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
            >
                {[...filteredItemsBySearchWithoutParent, ...parents].map((option, nindex) => {
                    if (option?.isLeaf) {
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
                                        (!selectedOption && !!maxSelection && maxSelection === selectedIds.length)
                                    }
                                />
                            </FirstLevelLeafWrapper>
                        );
                    }

                    const finalChildren = filteredItemsBySearch.filter(item =>
                        item.parents.some(p => p.id === option.id)
                    );
                    const children = items.filter(item => item.parents.some(p => p.id === option.id));

                    return (
                        <div key={`first-level-${nindex}`}>
                            <Node
                                nodeId={option.id}
                                name={option.name}
                                selectedCount={getSelectedCount(selectedIds, children)}
                                onSelectedChange={(_nodeId: string, selected: boolean) =>
                                    handleSelectedAllItemsInParent(finalChildren, selected)
                                }
                                selected={isAllItemParentSelected(option.id)}
                                disabled={isItemParentDisabled(finalChildren)}
                                hasSelectAll={hasSelectAll && !searchTerm}
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
                                                (!selected && !!maxSelection && maxSelection === selectedIds.length)
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
                                                (!selected && !!maxSelection && maxSelection === selectedIds.length)
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
    );
});

function getSelectedCount(selectedIds: string[], children: TreeOption[]): number {
    return children.reduce((acc: number, child: TreeOption): number => {
        if (child?.children) {
            const childrenCount = getSelectedCount(selectedIds, child.children);
            return selectedIds.includes(child.id) ? acc + childrenCount + 1 : acc + childrenCount;
        } else {
            return selectedIds.includes(child.id) ? acc + 1 : acc;
        }
    }, 0);
}

const HeaderContainer = styled.div<{ $fullWidth: boolean; $hasSearch: boolean }>`
    position: relative;
    width: ${props => (props.$fullWidth ? "100%" : "unset")};
    margin-block-start: ${props => (props.$hasSearch ? "16px" : "0")};
    margin-block-end: 6px;
`;

const FirstLevelLeafWrapper = styled.div`
    .MuiTreeItem-label {
        padding: 8px;
    }
`;
