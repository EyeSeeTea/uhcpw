import React, { useCallback } from "react";
import { Button, Paper } from "@material-ui/core";
import { Autocomplete, AutocompleteRenderGroupParams } from "@material-ui/lab";
import styled from "styled-components";

import i18n from "../../../../../locales";
import { DropdownTextField } from "../../../dropdown/DropdownTextField";
import { IndicatorOption } from "../../../../pages/indicator-explorer/IndicatorExplorerState";
import { CategoryGroup } from "./CategoryGroup";

interface IndicatorSelectorProps {
    label?: string;
    options: IndicatorOption[];
    selectedValue?: string | undefined;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value: string | undefined) => void;
    width?: string;
}

export const IndicatorSelector = React.memo(
    ({ label, options, selectedValue, placeholder, fullWidth, onChange, width = "100%" }: IndicatorSelectorProps) => {
        const [selectedOption, setSelectedOption] = React.useState<IndicatorOption | null>(null);

        React.useEffect(() => {
            setSelectedOption(options.find(option => option.value === selectedValue) || null);
        }, [options, selectedValue]);

        const handleChange = useCallback(
            (_event: React.ChangeEvent<{}>, value: unknown) => {
                onChange((value as IndicatorOption)?.value || undefined);
            },
            [onChange]
        );

        const handleClear = useCallback(() => {
            onChange(undefined);
            setSelectedOption(null);
        }, [onChange]);

        return (
            <Container width={width}>
                <StyledAutocomplete
                    PaperComponent={props => <StyledPaper {...props} />}
                    fullWidth={fullWidth}
                    multiple={false}
                    options={options}
                    groupBy={option => (option as IndicatorOption).category}
                    getOptionLabel={option => {
                        return `${(option as IndicatorOption).text}`;
                    }}
                    value={selectedOption || null}
                    onChange={handleChange}
                    renderInput={props => (
                        <DropdownTextField
                            {...props}
                            label={label}
                            placeholder={placeholder}
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                    renderGroup={(paramsGroup: AutocompleteRenderGroupParams) => {
                        return <CategoryGroup key={paramsGroup.key} params={paramsGroup} />;
                    }}
                    renderOption={option => (option as IndicatorOption).text}
                />
                {selectedValue ? (
                    <ClearButton variant="text" onClick={handleClear}>
                        {i18n.t("Clear")}
                    </ClearButton>
                ) : null}
            </Container>
        );
    }
);

const ClearButton = styled(Button)`
    color: orange;
    text-transform: none;
    position: absolute;
    right: -15px;
    padding: 0;
    font-weight: 400;
    top: 0;
`;

const Container = styled.div<{ width: string }>`
    position: relative;
    width: ${props => props.width || "100%"};
`;

const StyledAutocomplete = styled(Autocomplete)`
    div.MuiInputBase-root {
        border-radius: 20px;
    }
    .MuiAutocomplete-popupIndicator {
        margin-inline-end: 5px;
    }
`;

const StyledPaper = styled(Paper)`
    width: 600px;
`;
