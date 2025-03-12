import React from "react";
import { Button, TextField } from "@material-ui/core";
import styled from "styled-components";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import i18n from "../../../../../locales";
import { IndicatorOption } from "../../../../pages/indicator-explorer/IndicatorExplorerState";
import { FullScreenDialog } from "../../../dialog/FullScreenDialog";
import { useIndicatorTreeSelector } from "./useIndicatorTreeSelector";
import { IndicatorTreeSelectorList } from "./IndicatorTreeSelectorList";

type IndicatorTreeSelectorProps = {
    label?: string;
    options: IndicatorOption[];
    selectedValue?: string | undefined;
    placeholder?: string;
    fullWidth?: boolean;
    fullScreen?: boolean;
    onChange: (value: string | undefined) => void;
};

export const IndicatorTreeSelector = React.memo(
    ({
        label,
        options,
        selectedValue,
        placeholder,
        fullWidth = false,
        onChange,
        fullScreen = false,
    }: IndicatorTreeSelectorProps) => {
        const {
            inputRef,
            componentRef,
            dialogRef,
            selectedOption,
            expanded,
            openedMenu,
            searchTerm,
            setOpenedMenu,
            onSearchIndicator,
            onOptionClick,
            handleTextFieldClick,
            handleMenuClick,
            handleClear,
            treeOptions,
            containerWidth,
        } = useIndicatorTreeSelector({ options, selectedValue, onChange });

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
                {openedMenu &&
                    (fullScreen ? (
                        <FullScreenDialog
                            isOpen={openedMenu}
                            onClose={() => setOpenedMenu(false)}
                            title={i18n.t("Select category and indicator")}
                            ref={dialogRef}
                        >
                            <FullScreenContainer>
                                <StyledTextField
                                    aria-label={placeholder || "Indicator selector"}
                                    role={"textbox"}
                                    fullWidth={fullWidth}
                                    placeholder={placeholder}
                                    onChange={onSearchIndicator}
                                    value={searchTerm}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        "aria-label": `input ${placeholder || "Indicator selector"}`,
                                    }}
                                />
                                <IndicatorTreeSelectorList
                                    treeOptions={treeOptions}
                                    onOptionClick={onOptionClick}
                                    handleMenuClick={handleMenuClick}
                                    selectedOption={selectedOption}
                                    fullScreen
                                />
                            </FullScreenContainer>
                        </FullScreenDialog>
                    ) : (
                        <StyledMenu width={containerWidth}>
                            <IndicatorTreeSelectorList
                                treeOptions={treeOptions}
                                onOptionClick={onOptionClick}
                                handleMenuClick={handleMenuClick}
                                selectedOption={selectedOption}
                            />
                        </StyledMenu>
                    ))}

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

const StyledMenu = styled.div<{ width: string }>`
    z-index: 1;
    position: absolute;
    background-color: #ffffff;
    border-radius: 4px;
    width: ${props => props.width};
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

const FullScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
