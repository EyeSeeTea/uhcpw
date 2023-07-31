import React from "react";
import { IconButton, Menu, MenuItem, Divider, withStyles } from "@material-ui/core";
import { Menu as MenuIcon, CloseOutlined as CloseOutlinedIcon } from "@material-ui/icons";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import i18n from "../../../../locales";
import { useCountryOptionsOnlyBulgaria } from "../../../common/hooks/countries/useCountryOptionsOnlyBulgaria";
import { useHistory } from "react-router-dom";
import { MobileMenuSubItem } from "./MobileMenuSubItem";

export const MobileMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { countryOptions } = useCountryOptionsOnlyBulgaria();
    const history = useHistory();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (link?: string) => {
        setAnchorEl(null);
        if (link) {
            history.push(link);
        }
    };

    const StyledMenu = withStyles({
        paper: {
            border: "1px solid #d3d4d5",
            backgroundColor: colors.accentPrimary,
            color: "white",
            padding: "0px 10px",
        },
    })(Menu);

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                {open ? <CloseOutlinedIcon /> : <MenuIcon />}
            </IconButton>
            <StyledMenu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={() => handleCloseMenu()}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: -40,
                    horizontal: "center",
                }}
            >
                <MenuItem onClick={() => handleCloseMenu("/indicator-explorer")}>
                    {i18n.t("Indicator explorer")}
                </MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleCloseMenu("/policy-explorer")}>{i18n.t("Policy explorer")}</MenuItem>
                <StyledDivider />
                <MenuItem>
                    <MobileMenuSubItem item="countries">
                        <div>
                            {countryOptions.map(country => {
                                return (
                                    <MenuItem
                                        key={country.value}
                                        onClick={() => history.push(`country/${country.text.toLowerCase()}`)}
                                    >
                                        {country.text}
                                    </MenuItem>
                                );
                            })}
                        </div>
                    </MobileMenuSubItem>
                </MenuItem>
                <StyledDivider />
                <MenuItem>
                    <MobileMenuSubItem item="regions">
                        <ComingSoonTagContainer>
                            <Tag>{i18n.t("Coming soon")}</Tag>
                        </ComingSoonTagContainer>
                    </MobileMenuSubItem>
                </MenuItem>
                <StyledDivider />
                <MenuItem>
                    <MobileMenuSubItem item="methods">
                        <ComingSoonTagContainer>
                            <Tag>{i18n.t("Coming soon")}</Tag>
                        </ComingSoonTagContainer>
                    </MobileMenuSubItem>
                </MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleCloseMenu("/resources")}>{i18n.t("Resources")}</MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleCloseMenu("/about")}>{i18n.t("About us")}</MenuItem>
            </StyledMenu>
        </div>
    );
};

const StyledDivider = styled(Divider)`
    margin: 7px auto;
    width: 80%;
    background-color: #b5b5b5;
`;

const ComingSoonTagContainer = styled.div`
    margin: 22px 10px;
`;

const Tag = styled.div`
    display: flex;
    justify-content: center;
    min-width: 100px;
    background-color: #4fad56;
    color: white;
    font-size: 15px;
    border-radius: 30px;
    padding: 5px 10px;
`;
