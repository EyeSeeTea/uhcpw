import React, { useCallback } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import { IndicatorOption } from "../../../pages/indicator-explorer/IndicatorExplorerState";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { TreeItem, TreeView } from "@material-ui/lab";

type IndicatorTreeSelectorProps = {
    label?: string;
    options: IndicatorOption[];
    selectedValue?: string | undefined;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value: string | undefined) => void;
};

type IndicatorTreeOptions = {
    [category: string]: {
        [subcategory: string]: IndicatorOption[];
    };
};

const NO_SUBCATEGORY = "noSubcategory";

export const IndicatorTreeSelector = React.memo(
    ({ label, options, selectedValue, placeholder, fullWidth = false, onChange }: IndicatorTreeSelectorProps) => {
        const inputRef = React.useRef<HTMLDivElement>(null);
        const componentRef = React.useRef<HTMLDivElement>(null);

        const [selectedOption, setSelectedOption] = React.useState<IndicatorOption | undefined>(
            options.find(option => option.value === selectedValue)
        );
        const [expanded, setExpanded] = React.useState(false);
        const [openedMenu, setOpenedMenu] = React.useState(false);
        const [searchTerm, setSearchTerm] = React.useState<string>("");

        const treeOptions: IndicatorTreeOptions = React.useMemo(() => {
            const filteredOptions = options.filter(option => {
                return option.text.toLowerCase().includes(searchTerm.toLowerCase());
            });
            return filteredOptions.reduce((acc, option: IndicatorOption) => {
                const category = option.category;
                const subcategory =
                    !option.subcategory || option.subcategory === "" ? NO_SUBCATEGORY : option.subcategory;

                if (acc[category]) {
                    const currentOptions = (acc[category] || {})[subcategory];
                    return {
                        ...acc,
                        [category]: {
                            ...acc[category],
                            [subcategory]: [...(currentOptions || []), option],
                        },
                    };
                } else {
                    return {
                        ...acc,
                        [category]: {
                            [subcategory]: [option],
                        },
                    };
                }
            }, {} as IndicatorTreeOptions);
        }, [options, searchTerm]);

        const handleTextFieldClick = useCallback(
            (event: React.MouseEvent<HTMLInputElement>) => {
                event.preventDefault();
                setOpenedMenu(!openedMenu);
                setExpanded(!expanded);
                if (!openedMenu && inputRef.current) {
                    inputRef.current.focus();
                }
            },
            [expanded, openedMenu]
        );

        const handleClear = useCallback(() => {
            onChange(undefined);
            setSelectedOption(undefined);
            setSearchTerm("");
        }, [onChange]);

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    inputRef.current &&
                    !inputRef.current.contains(event.target as Node) &&
                    componentRef.current &&
                    !componentRef.current.contains(event.target as Node)
                ) {
                    setOpenedMenu(false);
                    setExpanded(!expanded);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [expanded]);

        const onOptionClick = React.useCallback(
            (event: React.MouseEvent<Element, MouseEvent>, option: IndicatorOption) => {
                event.preventDefault();
                setSelectedOption(option);
                onChange(option.value);
                setOpenedMenu(false);
                setExpanded(!expanded);
                setSearchTerm("");
            },
            [expanded, onChange]
        );

        const onSearchIndicator = React.useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(event.target.value);
                if (!event.target.value) {
                    onChange(undefined);
                    setSelectedOption(undefined);
                }
            },
            [onChange]
        );

        const handleMenuClick = React.useCallback((_event: React.MouseEvent<Element, MouseEvent>) => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        return (
            <Container $fullWidth={fullWidth} ref={componentRef}>
                <StyledTextField
                    inputRef={inputRef}
                    label={label}
                    aria-label={placeholder || "Indicator selector"}
                    onClick={handleTextFieldClick}
                    role={"textbox"}
                    fullWidth={fullWidth}
                    placeholder={placeholder}
                    onChange={onSearchIndicator}
                    value={searchTerm ? searchTerm : selectedOption?.text || searchTerm}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        "aria-label": `input ${placeholder || "Indicator selector"}`,
                    }}
                    InputProps={{
                        endAdornment: expanded ? (
                            <ArrowDropUpIcon htmlColor="black" style={{ cursor: "pointer" }} />
                        ) : (
                            <ArrowDropDownIcon htmlColor="black" style={{ cursor: "pointer" }} />
                        ),
                    }}
                />
                {openedMenu ? (
                    <StyledMenu>
                        <div role="listbox">
                            <TreeView
                                disableSelection
                                defaultCollapseIcon={<ArrowDropUpIcon aria-label="collapse-icon" />}
                                defaultExpandIcon={<ArrowDropDownIcon aria-label="expand-icon" />}
                                style={{ maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
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
                                                const currentSubcategoryOptions =
                                                    currentCategoryOptions[subcategory] || [];

                                                return subcategory === NO_SUBCATEGORY ? (
                                                    currentSubcategoryOptions.map((option: IndicatorOption) => {
                                                        return (
                                                            <TreeItem
                                                                key={`${category}-${subcategory}-${option.value}`}
                                                                nodeId={option.value}
                                                                label={<Label>{option.text}</Label>}
                                                                onLabelClick={event => onOptionClick(event, option)}
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
                                                                <TreeItem
                                                                    key={`${category}-${subcategory}-${option.value}`}
                                                                    nodeId={option.value}
                                                                    label={<Label>{option.text}</Label>}
                                                                    onLabelClick={event => onOptionClick(event, option)}
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
                    </StyledMenu>
                ) : null}

                {selectedValue ? (
                    <ClearButton variant="text" onClick={handleClear}>
                        {i18n.t("Clear")}
                    </ClearButton>
                ) : null}
            </Container>
        );
    }
);

const Container = styled.div<{ $fullWidth: boolean }>`
    position: relative;
    width: ${props => (props.$fullWidth ? "100%" : "unset")};
`;

const ClearButton = styled(Button)`
    color: orange;
    text-transform: none;
    position: absolute;
    right: -15px;
    padding: 0;
    font-weight: 400;
    top: 0;
`;

const Label = styled(Typography)`
    padding: 8px;
    font-weight: 400;
    font-size: 1rem;
`;

const StyledMenu = styled.div`
    z-index: 1;
    position: absolute;
    background-color: #ffffff;
    border-radius: 4px;
    width: 600px;
    padding: 16px;
    transition: opacity 345ms cubic-bezier(0.4, 0, 0.2, 1), transform 230ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14),
        0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    .MuiInputBase-root {
        border-radius: 4px;
    }
`;

const StyledTextField = styled(TextField)`
    position: relative;
    label.MuiInputLabel-root {
        transform: none;
        position: initial;
        margin-top: 3px;
        color: grey;
    }

    div.MuiInputBase-root.MuiInput-underline {
        border-radius: 20px;
        color: black;
        background: #f2f9fd;
        border: 1px solid #cfe9f7;
        min-width: 200px;
        padding: 8px 16px;

        &:before,
        &:after {
            border: none;
        }
    }
    .MuiAutocomplete-clearIndicator {
        display: none;
    }
`;
