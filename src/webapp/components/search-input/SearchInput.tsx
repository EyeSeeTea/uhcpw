import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Paper, Input, Theme } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import i18n from "../../../locales";
import _ from "lodash";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderRadius: "20px",
        alignItems: "center",
        padding: theme.spacing(1),
        display: "flex",
        flexBasis: 420,
        border: "1px solid #d6d3d3",
    },
    icon: {
        marginRight: theme.spacing(1),
        color: theme.palette.text.primary,
    },
    input: {
        flexGrow: 1,
        fontSize: "16px",
        lineHeight: "16px",
        letterSpacing: "-0.05px",
    },
}));

interface SearchInputProps {
    value: string;
    className?: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, className, onChange, style }) => {
    const classes = useStyles();

    const [stateValue, updateStateValue] = useState(value);
    useEffect(() => updateStateValue(value), [value]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChangeDebounced = useCallback(
        _.debounce((value: string) => {
            if (onChange) {
                onChange(value);
            }
        }, 400),
        [onChange]
    );

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            onChangeDebounced(value);
            updateStateValue(value);
        },
        [onChangeDebounced, updateStateValue]
    );

    const handleKeydown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation();
    }, []);

    return (
        <Paper className={clsx(classes.root, className)} style={style} elevation={0} role="search">
            <SearchIcon className={classes.icon} htmlColor="black" />
            <Input
                className={classes.input}
                disableUnderline
                onChange={handleChange}
                placeholder={i18n.t("Search")}
                value={stateValue}
                role="searchbox"
                onKeyDown={handleKeydown}
            />
        </Paper>
    );
};

export default SearchInput;
