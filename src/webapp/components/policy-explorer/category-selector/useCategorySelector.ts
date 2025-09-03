import { isEmpty } from "lodash";
import React from "react";
import { useCallback, useMemo, useState } from "react";

import {
    CATEGORIES_WITHOUT_SUBCATEGORIES,
    COMBINED_POLICY_TABLES_CATEGORY_ID,
} from "../../../pages/policy-explorer/usePolicyExplorer";
import { useMediaQuery } from "@material-ui/core";
import useWindowSize from "../../../common/hooks/screen/useWindowSize";

export type SubcategoryOption = {
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

type useCategorySelectorParmas = {
    categoryOptions: CategoryOption[];
    selectedCategoriesWithSubcategories?: Record<string, string[]>;
    onSelect: (value: Record<string, string[]> | undefined) => void;
    disabled?: boolean;
};

type State = {
    handleClick: (event: React.MouseEvent<HTMLInputElement>) => void;
    handleClose: () => void;
    handleSearchChange: (term: string) => void;
    handleDeleteCategoryFromSelection: (categoryId: string, subcategoryId?: string) => void;
    handleSelectedAllSubcategories: (categoryId: string, selected: boolean, subcategories: SubcategoryOption[]) => void;
    handleSubcategoriesChange: (parentCategoryId: string, subcategoryId: string, selected: boolean) => void;
    isAllCategorySelected: (categoryId: string) => boolean;
    isSubcategorySelected: (categoryId: string, subcategoryId: string) => boolean;
    categoriesSelection: CategoryOption[];
    filteredCategories: CategoryOption[];
    handleClear: () => void;
    handleSelectAll: () => void;
    disableSelectAll: boolean;
    anchorEl: HTMLElement | null;
    expanded: boolean;
    searchTerm: string;
    isClearDisabled: boolean;
    containerWidth: string;
    isSmallScreen: boolean;
};

export const useCategorySelector = ({
    categoryOptions,
    selectedCategoriesWithSubcategories,
    onSelect,
    disabled = false,
}: useCategorySelectorParmas): State => {
    const isSmallScreen = useMediaQuery("(max-width:700px)");
    const { width } = useWindowSize();

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
                } else {
                    const newSelection = maybeNewSelection;
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
                (selectedCategoriesWithSubcategories && selectedCategoriesWithSubcategories[parentCategoryId]) || [];
            const newSubcategories = selected
                ? [...currentSubcategories, subcategoryId]
                : currentSubcategories.filter(id => id !== subcategoryId);

            if (newSubcategories.length) {
                onSelect && onSelect({ ...selectedCategoriesWithSubcategories, [parentCategoryId]: newSubcategories });
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

            return isEmpty(selectedCategoriesWithSubcategories) || categoryNotSelected || allSubcategoriesNotSelected;
        });

        return categoriesToBeSelected.length === 0;
    }, [filteredCategories, selectedCategoriesWithSubcategories]);

    const isClearDisabled = useMemo(() => {
        return isEmpty(selectedCategoriesWithSubcategories);
    }, [selectedCategoriesWithSubcategories]);

    const containerWidth = useMemo(() => {
        return isSmallScreen ? `${width - 100}px` : "600px";
    }, [isSmallScreen, width]);

    return {
        handleClick,
        handleClose,
        handleSearchChange,
        handleDeleteCategoryFromSelection,
        handleSelectedAllSubcategories,
        handleSubcategoriesChange,
        isAllCategorySelected,
        isSubcategorySelected,
        categoriesSelection,
        filteredCategories,
        handleClear,
        handleSelectAll,
        disableSelectAll,
        anchorEl,
        expanded,
        searchTerm,
        isClearDisabled,
        containerWidth,
        isSmallScreen,
    };
};
