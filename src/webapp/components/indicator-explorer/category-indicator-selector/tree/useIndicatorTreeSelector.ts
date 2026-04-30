import React, { useCallback } from "react";

import { IndicatorOption } from "../../../../pages/indicator-explorer/IndicatorExplorerState";
import { useMediaQuery } from "@material-ui/core";
import useWindowSize from "../../../../common/hooks/screen/useWindowSize";

export type IndicatorTreeOptions = {
    [category: string]: {
        [subcategory: string]: IndicatorOption[];
    };
};

type IndicatorTreeSelectorParams = {
    selectedValue?: string | undefined;
    options: IndicatorOption[];
    onChange: (value: string | undefined) => void;
};

type IndicatorTreeSelectorState = {
    inputRef: React.RefObject<HTMLDivElement>;
    componentRef: React.RefObject<HTMLDivElement>;
    dialogRef: React.RefObject<HTMLDivElement>;
    selectedOption: IndicatorOption | undefined;
    expanded: boolean;
    openedMenu: boolean;
    searchTerm: string;
    treeOptions: IndicatorTreeOptions;
    handleTextFieldClick: (event: React.MouseEvent<HTMLInputElement>) => void;
    handleClear: () => void;
    onOptionClick: (event: React.MouseEvent<Element, MouseEvent>, option: IndicatorOption) => void;
    onSearchIndicator: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleMenuClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
    setOpenedMenu: (value: boolean) => void;
    containerWidth: string;
    onSearchAndClearIndicator: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isSmallScreen: boolean;
};

export const NO_SUBCATEGORY = "noSubcategory";

export const useIndicatorTreeSelector = (params: IndicatorTreeSelectorParams): IndicatorTreeSelectorState => {
    const { options, selectedValue, onChange } = params;

    const isSmallScreen = useMediaQuery("(max-width:700px)");
    const { width } = useWindowSize();

    const inputRef = React.useRef<HTMLDivElement>(null);
    const componentRef = React.useRef<HTMLDivElement>(null);
    const dialogRef = React.useRef<HTMLDivElement>(null);

    const [selectedOption, setSelectedOption] = React.useState<IndicatorOption | undefined>(
        options.find(option => option.value === selectedValue)
    );

    React.useEffect(() => {
        const initialValue = options.find(option => option.value === selectedValue);
        if (initialValue && initialValue !== selectedOption) {
            setSelectedOption(initialValue);
        }
    }, [selectedValue, options, selectedOption]);

    const [expanded, setExpanded] = React.useState(false);
    const [openedMenu, setOpenedMenu] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    const treeOptions: IndicatorTreeOptions = React.useMemo(() => {
        const filteredOptions = options.filter(option => {
            return option.text.toLowerCase().includes(searchTerm.toLowerCase());
        });
        return filteredOptions.reduce((acc, option: IndicatorOption) => {
            const category = option.category;
            const subcategory = !option.subcategory || option.subcategory === "" ? NO_SUBCATEGORY : option.subcategory;

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
                !componentRef.current.contains(event.target as Node) &&
                dialogRef.current &&
                !dialogRef.current.contains(event.target as Node)
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

    const onSearchIndicator = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const onSearchAndClearIndicator = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
            if (!event.target.value) {
                handleClear();
            }
        },
        [handleClear]
    );

    const handleMenuClick = React.useCallback((_event: React.MouseEvent<Element, MouseEvent>) => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const containerWidth = React.useMemo(() => {
        return isSmallScreen ? `${width - 130}px` : "600px";
    }, [isSmallScreen, width]);

    return {
        inputRef,
        componentRef,
        dialogRef,
        selectedOption,
        expanded,
        openedMenu,
        searchTerm,
        treeOptions,
        handleTextFieldClick,
        handleClear,
        onOptionClick,
        onSearchIndicator,
        handleMenuClick,
        setOpenedMenu,
        containerWidth,
        onSearchAndClearIndicator,
        isSmallScreen,
    };
};
