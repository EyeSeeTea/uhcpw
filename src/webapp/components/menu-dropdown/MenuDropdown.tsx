import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Popper, List, ListItem, ListItemText } from "@material-ui/core";

import { DropdownTextField } from "../dropdown/DropdownTextField";
import { Option } from "../dropdown/Option";
import { FullScreenDialog } from "../dialog/FullScreenDialog";
import i18n from "../../../locales";
import { Id } from "../../../domain/entities/Ref";

type MenuDropdownProps = {
    id?: string;
    label?: string;
    options: Option<Id>[];
    value?: Id;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value: Id) => void;
    width?: string;
    forceRotation?: boolean;
    fullScreen?: boolean;
};

export const MenuDropdown: React.FC<MenuDropdownProps> = React.memo(props => {
    const {
        id,
        label,
        options,
        value,
        placeholder,
        fullWidth,
        width = "100%",
        onChange,
        forceRotation = false,
        fullScreen = false,
    } = props;
    const [valueOption, setValueOption] = useState<Option<string> | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setValueOption(options.find(option => option.value === value) || null);
    }, [options, value]);

    const handleChange = useCallback(
        (_event: React.ChangeEvent<{}>, selectedValue: unknown) => {
            if (selectedValue && (selectedValue as Option<Id>)?.value) {
                onChange((selectedValue as Option<Id>).value);
            }
        },
        [onChange]
    );

    return (
        <Container width={width} aria-label={`${id}-menu-dropdown`}>
            <StyledAutocomplete
                PopperComponent={props => (forceRotation ? <StyledPopper {...props} /> : <Popper {...props} />)}
                fullWidth={fullWidth}
                id={id}
                options={options}
                value={valueOption || null}
                getOptionLabel={option => (option as Option<Id>)?.text}
                renderInput={params => (
                    <DropdownTextField
                        {...params}
                        label={label}
                        placeholder={placeholder}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            ...params.InputProps,
                            readOnly: forceRotation,
                        }}
                    />
                )}
                onChange={handleChange}
                open={fullScreen ? false : open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
            />
            {fullScreen && open ? (
                <FullScreenDialog
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    title={i18n.t("Select category and indicator")}
                    forceRotation={forceRotation}
                >
                    <FullScreenContainer>
                        <List>
                            {options.map(option => (
                                <ListItem
                                    button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemText primary={option.text} />
                                </ListItem>
                            ))}
                        </List>
                    </FullScreenContainer>
                </FullScreenDialog>
            ) : null}
        </Container>
    );
});

const Container = styled.div<{ width: string }>`
    position: relative;
    width: ${props => props.width || "100%"};
`;

const StyledAutocomplete = styled(Autocomplete)`
    div.MuiInputBase-root {
        border-radius: 20px;
    }
    .MuiAutocomplete-popupIndicator {
        margin-right: 5px;
    }
`;

const StyledPopper = styled.div`
    position: absolute;
`;

const FullScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
