import React from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { TreeView } from "@material-ui/lab";

import SearchInput from "../../search-input/SearchInput";
import { SelectionListHeader } from "../../selection-list-header/SelectionListHeader";
import { Node } from "./Node";
import { Leaf } from "./Leaf";
import { CategoryOption, SubcategoryOption } from "./useCategorySelector";

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
    isSmallScreen: boolean;
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
        isClearDisabled,
        handleSelectedAllSubcategories,
        handleSubcategoriesChange,
        isAllCategorySelected,
        isSubcategorySelected,
        fullScreen,
        isSmallScreen,
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
                <SelectionListHeader
                    title={placeholder}
                    selectAll={{ onClick: handleSelectAll, disabled: disableSelectAll }}
                    clear={{ onClick: handleClear, disabled: isClearDisabled }}
                    isSmallScreen={isSmallScreen}
                />
                <TreeView
                    disableSelection
                    aria-label="Categories tree"
                    defaultCollapseIcon={<ArrowDropUpIcon />}
                    defaultExpandIcon={<ArrowDropDownIcon />}
                    style={fullScreen ? {} : { maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
                >
                    {filteredCategories.map(category => {
                        if (category.type === "group") {
                            return (
                                <Node
                                    key={category.text}
                                    nodeId={category.text}
                                    name={category.text}
                                    selected={false}
                                    onSelectedChange={() => undefined}
                                    disabledSelection
                                >
                                    {category.categories.map(selectableCategory => (
                                        <Node
                                            key={selectableCategory.value}
                                            nodeId={selectableCategory.value}
                                            name={selectableCategory.text}
                                            selected={isAllCategorySelected(selectableCategory.value)}
                                            onSelectedChange={(nodeId: string, selected: boolean) =>
                                                handleSelectedAllSubcategories(
                                                    nodeId,
                                                    selected,
                                                    selectableCategory.subcategories
                                                )
                                            }
                                        >
                                            {selectableCategory.subcategories.map(({ value, text }) => (
                                                <Leaf
                                                    key={value}
                                                    nodeId={value}
                                                    parentId={selectableCategory.value}
                                                    name={text}
                                                    selected={isSubcategorySelected(selectableCategory.value, value)}
                                                    onSelectedChange={handleSubcategoriesChange}
                                                />
                                            ))}
                                        </Node>
                                    ))}
                                </Node>
                            );
                        }

                        return (
                            <Node
                                key={category.value}
                                nodeId={category.value}
                                name={category.text}
                                selected={isAllCategorySelected(category.value)}
                                onSelectedChange={(nodeId: string, selected: boolean) =>
                                    handleSelectedAllSubcategories(nodeId, selected, category.subcategories)
                                }
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
                        );
                    })}
                </TreeView>
            </div>
        );
    }
);
