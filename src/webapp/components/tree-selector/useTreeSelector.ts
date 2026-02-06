import { useMediaQuery } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { useCallback, useMemo, useState } from "react";

import {
    BOSNIA_AND_HERZEGOVINA_LEVEL_4,
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
} from "../../../data/repositories/countries/CountryD2Repository";
import useWindowSize from "../../common/hooks/screen/useWindowSize";
import { TreeOption } from "./TreeSelector";

type useTreeSelectorParams = {
    items: TreeOption[];
    selectedIds?: string[];
    onSelectedIdsChange: (ids: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    disabledItems?: string[];
    hasSelectAll?: boolean;
    hasClearAll?: boolean;
    maxSelection?: number;
    showParentIfChecked?: boolean;
    showOnlyAllParentSelectedIfChecked?: boolean;
    showSubChildren?: boolean;
    defaultExpanded?: string[];
    selectedItemsToShowWhenAllSelected?: string[];
    parentSort?: (a: string, b: string) => number;
    fullScreen?: boolean;
};

type useTreeSelectorState = {
    handleClick: (event: React.MouseEvent<HTMLInputElement>) => void;
    finalPlaceholder: string | undefined;
    selectedChips: (
        | TreeOption
        | {
              isLeaf: boolean;
              id: string;
              name: string;
          }
    )[];
    handleSelectedChange: (nodeId: string, selected: boolean) => void;
    containerWidth: string;
    expanded: boolean;
    anchorEl: HTMLElement | null;
    handleClose: () => void;
    searchTerm: string;
    handleSearchChange: (term: string) => void;
    isSmallScreen: boolean;
    handleToggle: (_event: React.ChangeEvent<{}>, nodeIds: string[]) => void;
    expandedParents: string[];
    handleSelectAll: () => void;
    handleClear: () => void;
    filteredItemsBySearchWithoutParent: TreeOption[];
    parents: {
        isLeaf: boolean;
        id: string;
        name: string;
    }[];
    filteredItemsBySearch: TreeOption[];
    areAllItemsSelected: boolean;
    handleSelectedAllItemsInParent: (allItemsInSelectedParent: TreeOption[], selected: boolean) => void;
    isAllItemParentSelected: (itemParentId: string) => boolean | undefined;
    isItemParentDisabled: (allItemsInSelectedParent: TreeOption[]) => boolean;
    itemsToSelect: string[];
    menuContentRef: React.MutableRefObject<HTMLDivElement | null>;
};

export const ALL_NODE_ID = "all";
const EMPTY_IDS_ARRAY: string[] = [];

export const useTreeSelector = (params: useTreeSelectorParams): useTreeSelectorState => {
    const {
        items,
        selectedIds = EMPTY_IDS_ARRAY,
        onSelectedIdsChange,
        placeholder,
        disabled,
        disabledItems,
        hasSelectAll,
        hasClearAll,
        maxSelection,
        showParentIfChecked,
        showOnlyAllParentSelectedIfChecked,
        showSubChildren,
        defaultExpanded = EMPTY_IDS_ARRAY,
        selectedItemsToShowWhenAllSelected = EMPTY_IDS_ARRAY,
        parentSort = (_a: string, _b: string) => 0,
        fullScreen,
    } = params;

    const menuContentRef = React.useRef<HTMLDivElement | null>(null);

    const isSmallScreen = useMediaQuery("(max-width:700px)");
    const { width } = useWindowSize();

    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [expandedParents, setExpandedParents] = React.useState<string[]>([ALL_NODE_ID, ...defaultExpanded]);

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

    React.useEffect(() => {
        if (!anchorEl || fullScreen) return;

        const onDocMouseDown = (e: MouseEvent) => {
            const target = e.target;

            if (!(target instanceof Node)) return;

            const clickInsideMenu = menuContentRef.current?.contains(target);
            const clickOnAnchor = anchorEl.contains(target);

            if (!clickInsideMenu && !clickOnAnchor) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", onDocMouseDown, true);
        return () => document.removeEventListener("mousedown", onDocMouseDown, true);
    }, [anchorEl, fullScreen, handleClose]);

    const filteredItemsBySearch: TreeOption[] = useMemo(() => {
        return items.reduce((acc: TreeOption[], item) => {
            const filteredItemChildren =
                item.children?.length && showSubChildren
                    ? item.children?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    : undefined;

            if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || filteredItemChildren?.length) {
                // When searching the Federation of Bosnia and Herzegovina return also the Republika Srpska
                const itemChildren =
                    item.id === BOSNIA_AND_HERZEGOVINA_LEVEL_4 &&
                    _(filteredItemChildren).some({ id: FEDERACIJA_BOSNE_I_HERCEGOVINE })
                        ? item.children
                        : filteredItemChildren;
                return [
                    ...acc,
                    item.children?.length && showSubChildren
                        ? {
                              ...item,
                              children: itemChildren,
                          }
                        : item,
                ];
            }
            return acc;
        }, []);
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
                    if (nodeId === ALL_NODE_ID && showOnlyAllParentSelectedIfChecked) {
                        onSelectedIdsChange([
                            ...selectedIds.filter(id => selectedItemsToShowWhenAllSelected.includes(id)),
                        ]);
                    } else {
                        const finalChildren = filteredItemsBySearch.filter(item =>
                            item.parents.some(p => p.id === nodeId)
                        );
                        handleSelectedAllItemsInParent(finalChildren, selected);
                    }
                } else {
                    const selection = selectedIds.filter(id => id !== nodeId);

                    if (onSelectedIdsChange) {
                        onSelectedIdsChange(selection);
                    }
                }
            }
        },
        [
            selectedIds,
            onSelectedIdsChange,
            items,
            showOnlyAllParentSelectedIfChecked,
            selectedItemsToShowWhenAllSelected,
            filteredItemsBySearch,
            handleSelectedAllItemsInParent,
        ]
    );

    const selectedItems = useMemo(() => {
        const selectedSubChildren = showSubChildren
            ? items.flatMap(item => (item.children ? item.children : [])).filter(item => selectedIds.includes(item.id))
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
        return _.uniqBy(filteredItemsBySearch.map(item => item.parents).flat(), item => item.id)
            .sort((a, b) => parentSort(a.id, b.id))
            .map(parent => ({
                ...parent,
                isLeaf: false,
            }));
    }, [filteredItemsBySearch, parentSort]);

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
                const finalChildrenAllowed = items
                    .filter(item => item.parents.some(p => p.id === itemParentId))
                    .filter(({ id }) => !disabledItems?.includes(id));

                const finalSubChildrenAllowed = showSubChildren
                    ? finalChildrenAllowed
                          .flatMap(item => (item.children ? item.children : []))
                          .filter(({ id }) => !disabledItems?.includes(id))
                    : [];

                const allowedSelection = showSubChildren
                    ? [...finalSubChildrenAllowed, ...finalChildrenAllowed]
                    : finalChildrenAllowed;

                return !!allowedSelection.length && allowedSelection.every(item => selectedIds.includes(item.id));
            }
        },
        [hasSelectAll, items, showSubChildren, disabledItems, selectedIds]
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
        const selection = items.filter(({ id }) => !selectedIds?.includes(id) && !disabledItems?.includes(id));
        const selectedSubChildren = showSubChildren
            ? items
                  .flatMap(item => (item.children ? item.children : []))
                  .filter(({ id }) => !selectedIds?.includes(id) && !disabledItems?.includes(id))
            : [];
        return [...selection, ...selectedSubChildren]?.length === 0;
    }, [disabledItems, items, selectedIds, showSubChildren]);

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
            onSelectedIdsChange([...itemsToSelect, ...selectedIds]);
        }
    }, [hasSelectAll, onSelectedIdsChange, itemsToSelect, selectedIds]);

    const selectedChips = useMemo(() => {
        if (maxSelection === 1) {
            return selectedItems.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                return 0;
            });
        }

        const allSelectedParent = parents.find(parent => parent.id === ALL_NODE_ID);

        const dataToShow =
            showParentIfChecked && areAllItemsSelected && parents.length > 0
                ? [...parents, ...selectedItems.filter(item => selectedItemsToShowWhenAllSelected.includes(item.id))]
                : selectedItems;

        const selectedDataToShow =
            allSelectedParent && isAllItemParentSelected(allSelectedParent.id) && showOnlyAllParentSelectedIfChecked
                ? [
                      allSelectedParent,
                      ...selectedItems.filter(item => selectedItemsToShowWhenAllSelected.includes(item.id)),
                  ]
                : dataToShow;

        return selectedDataToShow.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    }, [
        maxSelection,
        parents,
        showParentIfChecked,
        areAllItemsSelected,
        selectedItems,
        isAllItemParentSelected,
        showOnlyAllParentSelectedIfChecked,
        selectedItemsToShowWhenAllSelected,
    ]);

    const finalPlaceholder = useMemo(() => {
        return selectedChips.length === 0 ? placeholder : "";
    }, [placeholder, selectedChips.length]);

    const containerWidth = useMemo(() => {
        return isSmallScreen ? `${width - 100}px` : "600px";
    }, [isSmallScreen, width]);

    return {
        handleClick,
        finalPlaceholder,
        selectedChips,
        handleSelectedChange,
        containerWidth,
        expanded,
        anchorEl,
        handleClose,
        searchTerm,
        handleSearchChange,
        isSmallScreen,
        handleToggle,
        expandedParents,
        handleSelectAll,
        handleClear,
        filteredItemsBySearchWithoutParent,
        parents,
        filteredItemsBySearch,
        areAllItemsSelected,
        handleSelectedAllItemsInParent,
        isAllItemParentSelected,
        isItemParentDisabled,
        itemsToSelect,
        menuContentRef,
    };
};
