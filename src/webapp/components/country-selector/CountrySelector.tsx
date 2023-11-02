import { InputAdornment, Menu, Typography } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import i18n from "../../../locales";
import { DropdownTextField } from "../dropdown/DropdownTextField";
import SearchInput from "../search-input/SearchInput";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { TreeView } from "@material-ui/lab";
import { Node } from "./Node";
import { Leaf } from "./Leaf";
import _ from "lodash";
import { SelectedChip } from "../selected-chip/SelectedChip";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

export type CountryOption = {
    id: string;
    name: string;
    code?: string;
    parents: { id: string; name: string }[];
};

interface CountrySelectorProps {
    countries: CountryOption[];
    selectedIds?: string[];
    onSelectedIdsChange?: (ids: string[]) => void;
    fullWidth?: boolean;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    disabledCountries?: string[];
}

export const CountrySelector: React.FC<CountrySelectorProps> = React.memo(
    ({
        countries,
        selectedIds = [],
        onSelectedIdsChange,
        fullWidth,
        placeholder,
        disabled,
        label,
        disabledCountries,
    }) => {
        const [expanded, setExpanded] = useState(false);
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const [searchTerm, setSearchTerm] = React.useState<string>("");
        const [expandedParents, setExpandedParents] = React.useState<string[]>([]);

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

        const handleSelectedChange = useCallback(
            (nodeId: string, selected: boolean) => {
                if (selected) {
                    const selected = [...selectedIds, nodeId];

                    if (onSelectedIdsChange) {
                        onSelectedIdsChange(selected);
                    }
                } else {
                    const selected = selectedIds.filter(id => id !== nodeId);

                    if (onSelectedIdsChange) {
                        onSelectedIdsChange(selected);
                    }
                }
            },
            [selectedIds, onSelectedIdsChange]
        );

        const selectedCountries = useMemo(() => {
            return countries.filter(country => selectedIds.includes(country.id));
        }, [countries, selectedIds]);

        const handleSearchChange = useCallback(
            (term: string) => {
                if (term) {
                    const parentsToExpand: string[] = [];
                    const filterCountries = countries.filter(country =>
                        country.name.toLowerCase().includes(term.toLowerCase())
                    );
                    const filterParents = _.uniqBy(filterCountries.map(country => country.parents).flat(), "id");
                    filterParents.forEach(({ id }) => {
                        const finalChildren = filterCountries.filter(country =>
                            country.parents.some(parent => parent.id === id)
                        );
                        if (finalChildren.length) parentsToExpand.push(id);
                    });
                    setExpandedParents(parentsToExpand);
                }
                setSearchTerm(term);
            },
            [countries, setSearchTerm, setExpandedParents]
        );

        const finalCountries = useMemo(() => {
            return countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }, [searchTerm, countries]);

        const parents = useMemo(() => {
            return _.uniqBy(finalCountries.map(country => country.parents).flat(), "id");
        }, [finalCountries]);

        const handleToggle = useCallback((_event: React.ChangeEvent<{}>, nodeIds: string[]) => {
            setExpandedParents(nodeIds);
        }, []);

        return (
            <>
                <StyledDropdownTextField
                    label={label}
                    aria-label="Country selector"
                    onClick={handleClick}
                    placeholder={placeholder}
                    role={"textbox"}
                    fullWidth={fullWidth}
                    value={""}
                    disabled={disabled}
                    inputProps={{
                        "aria-label": "Select countries",
                    }}
                    InputProps={{
                        startAdornment: (
                            <SelectedContainer>
                                {selectedCountries.map(country => {
                                    return (
                                        <SelectedChip
                                            key={country.id}
                                            label={country.name}
                                            onDelete={() => handleSelectedChange(country.id, false)}
                                            deleteIcon={<CloseIcon fontSize="small" />}
                                        />
                                    );
                                })}
                            </SelectedContainer>
                        ),
                        endAdornment: (
                            <InputAdornment
                                position="start"
                                aria-label="expand"
                                style={{
                                    top: "calc(50% - 14px)",
                                    right: 0,
                                    position: "absolute",
                                    height: "24px",
                                }}
                            >
                                {expanded ? (
                                    <ArrowDropUpIcon htmlColor="black" style={{ cursor: "pointer" }} />
                                ) : (
                                    <ArrowDropDownIcon htmlColor="black" style={{ cursor: "pointer" }} />
                                )}
                            </InputAdornment>
                        ),
                    }}
                    $isDisabled={disabled}
                />
                <StyledMenu
                    PaperProps={{ style: { width: "600px", padding: "16px" } }}
                    id="country-selector"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    onClose={handleClose}
                >
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
                        <Typography variant="body1" gutterBottom>
                            {i18n.t("Select country")}
                        </Typography>
                        <TreeView
                            disableSelection
                            defaultCollapseIcon={<ArrowDropUpIcon />}
                            defaultExpandIcon={<ArrowDropDownIcon />}
                            onNodeToggle={handleToggle}
                            expanded={expandedParents}
                            style={{ maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
                        >
                            {parents.map((parent, nindex) => {
                                const finalChildren = finalCountries.filter(country =>
                                    country.parents.some(p => p.id === parent.id)
                                );
                                const children = countries.filter(country =>
                                    country.parents.some(p => p.id === parent.id)
                                );
                                const selectedCount = children.filter(child => selectedIds.includes(child.id)).length;

                                return (
                                    <div key={nindex}>
                                        <Node nodeId={parent.id} name={parent.name} selectedCount={selectedCount}>
                                            {finalChildren.map((child, lindex) => {
                                                const selected = selectedIds.find(id => id === child.id) !== undefined;

                                                return (
                                                    <Leaf
                                                        key={lindex}
                                                        nodeId={child.id}
                                                        name={child.name}
                                                        selected={selected}
                                                        onSelectedChange={handleSelectedChange}
                                                        disabled={disabledCountries?.includes(child.id)}
                                                    />
                                                );
                                            })}
                                        </Node>
                                    </div>
                                );
                            })}
                        </TreeView>
                    </div>
                </StyledMenu>
            </>
        );
    }
);

const SelectedContainer = styled.div`
    max-width: 100%;
    display: flow-root;
`;

const StyledMenu = styled(Menu)`
    .MuiInputBase-root {
        border-radius: 20px;
    }
`;

const StyledDropdownTextField = styled(DropdownTextField)`
    .MuiInputBase-root {
        border-radius: 20px !important;
        color: black;
    }
    .MuiInputBase-input {
        caret-color: transparent;
    }
`;
