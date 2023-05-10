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

export type CountryOption = {
    id: string;
    name: string;
    parents: { id: string; name: string }[];
};

interface CountrySelectorProps {
    countries: CountryOption[];
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ countries }) => {
    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLInputElement>) => {
            setAnchorEl(event.currentTarget);
            setExpanded(!expanded);
        },
        [expanded, setExpanded, setAnchorEl]
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

    const handleSelectedChange = useCallback(
        (nodeId: string, selected: boolean) => {
            if (selected) {
                setSelectedIds([...selectedIds, nodeId]);
            } else {
                setSelectedIds(selectedIds.filter(id => id !== nodeId));
            }
        },
        [setSelectedIds, selectedIds]
    );

    const finalCountries = useMemo(() => {
        return countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, countries]);

    const parents = useMemo(() => {
        return _.uniqBy(finalCountries.map(country => country.parents).flat(), "id");
    }, [finalCountries]);

    return (
        <>
            <DropdownTextField
                label={i18n.t("Countries")}
                onClick={handleClick}
                aria-label="Countries"
                role={"textbox"}
                disabled
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment
                            position="start"
                            style={{ top: "calc(50% - 14px)", right: 0, position: "absolute", height: " 24px" }}
                        >
                            {expanded ? <ArrowDropUpIcon htmlColor="black" /> : <ArrowDropDownIcon htmlColor="black" />}
                        </InputAdornment>
                    ),
                }}
            />
            <Menu
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
                        style={{ height: "20px", background: "#f2f9fd", border: "1px solid #cfe9f7" }}
                    />
                    <br />
                    <Typography variant="body1" gutterBottom>
                        {i18n.t("Select country")}
                    </Typography>
                    <TreeView
                        disableSelection
                        aria-label="file system navigator"
                        defaultCollapseIcon={<ArrowDropUpIcon />}
                        defaultExpandIcon={<ArrowDropDownIcon />}
                        style={{ maxHeight: 300, flexGrow: 1, overflowY: "auto" }}
                    >
                        {parents.map((parent, nindex) => {
                            const finalChildren = finalCountries.filter(country =>
                                country.parents.some(p => p.id === parent.id)
                            );
                            const children = countries.filter(country => country.parents.some(p => p.id === parent.id));
                            const selectedCount = children.filter(child => selectedIds.includes(child.id)).length;

                            return (
                                <Node key={nindex} nodeId={parent.id} name={parent.name} selectedCount={selectedCount}>
                                    {finalChildren.map((child, lindex) => {
                                        const selected = selectedIds.find(id => id === child.id) !== undefined;

                                        return (
                                            <Leaf
                                                key={lindex}
                                                nodeId={child.id}
                                                name={child.name}
                                                selected={selected}
                                                onSelectedChange={handleSelectedChange}
                                            />
                                        );
                                    })}
                                </Node>
                            );
                        })}
                    </TreeView>
                </div>
            </Menu>
        </>
    );
};
