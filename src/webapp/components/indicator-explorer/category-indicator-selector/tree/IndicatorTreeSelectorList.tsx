import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { TreeItem, TreeView } from "@material-ui/lab";

import { IndicatorOption } from "../../../../pages/indicator-explorer/IndicatorExplorerState";
import { Maybe } from "../../../../../types/utils";
import { IndicatorTreeOptions, NO_SUBCATEGORY } from "./useIndicatorTreeSelector";

type IndicatorTreeSelectorListProps = {
    treeOptions: IndicatorTreeOptions;
    selectedOption: Maybe<IndicatorOption>;
    onOptionClick: (event: React.MouseEvent<Element, MouseEvent>, option: IndicatorOption) => void;
    handleMenuClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
    fullScreen?: boolean;
};

export const IndicatorTreeSelectorList = React.memo(
    ({
        treeOptions,
        selectedOption,
        onOptionClick,
        handleMenuClick,
        fullScreen = false,
    }: IndicatorTreeSelectorListProps) => {
        return (
            <div role="listbox">
                <TreeView
                    disableSelection
                    defaultCollapseIcon={<ArrowDropUpIcon aria-label="collapse-icon" />}
                    defaultExpandIcon={<ArrowDropDownIcon aria-label="expand-icon" />}
                    style={fullScreen ? {} : { maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
                >
                    {Object.keys(treeOptions).map((category: string) => {
                        const currentCategoryOptions = treeOptions[category] || {};

                        return (
                            <TreeItem
                                key={category}
                                nodeId={category}
                                label={<Label>{category}</Label>}
                                onIconClick={handleMenuClick}
                                onLabelClick={handleMenuClick}
                            >
                                {Object.keys(currentCategoryOptions).map((subcategory: string) => {
                                    const currentSubcategoryOptions = currentCategoryOptions[subcategory] || [];

                                    return subcategory === NO_SUBCATEGORY ? (
                                        currentSubcategoryOptions.map((option: IndicatorOption) => {
                                            return (
                                                <StyledTreeItem
                                                    key={`${category}-${subcategory}-${option.value}`}
                                                    nodeId={option.value}
                                                    label={<Label>{option.text}</Label>}
                                                    onLabelClick={event => onOptionClick(event, option)}
                                                    $isSelected={selectedOption?.value === option.value}
                                                />
                                            );
                                        })
                                    ) : (
                                        <TreeItem
                                            key={`${category}-${subcategory}`}
                                            nodeId={`${category}-${subcategory}`}
                                            label={<Label>{subcategory}</Label>}
                                            onIconClick={handleMenuClick}
                                            onLabelClick={handleMenuClick}
                                        >
                                            {currentSubcategoryOptions.map((option: IndicatorOption) => {
                                                return (
                                                    <StyledTreeItem
                                                        key={`${category}-${subcategory}-${option.value}`}
                                                        nodeId={option.value}
                                                        label={<Label>{option.text}</Label>}
                                                        onLabelClick={event => onOptionClick(event, option)}
                                                        $isSelected={selectedOption?.value === option.value}
                                                    />
                                                );
                                            })}
                                        </TreeItem>
                                    );
                                })}
                            </TreeItem>
                        );
                    })}
                </TreeView>
            </div>
        );
    }
);

const Label = styled(Typography)`
    padding: 8px;
    font-weight: 400;
    font-size: 1rem;
`;

const StyledTreeItem = styled(TreeItem)<{ $isSelected?: boolean }>`
    .MuiTreeItem-label {
        background-color: ${({ $isSelected }) => ($isSelected ? "#f1f9fc" : "white")};
    }
`;
