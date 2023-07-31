import { Button, Menu, Typography, withStyles } from "@material-ui/core";
import i18n from "../../../../locales";
import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import styled from "styled-components";

type SubItemType = {
    item: string;
    children: JSX.Element;
};

export const MobileMenuSubItem = ({ item, children }: SubItemType) => {
    const [anchorElSubmenu, setAnchorElSubmenu] = React.useState<null | HTMLElement>(null);

    const handleSubMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSubmenu(event.currentTarget);
    };

    const StyledSubMenu = withStyles({
        paper: {
            border: "1px solid #d3d4d5",
            backgroundColor: colors.accentPrimary,
            color: "white",
            padding: "0px 10px",
        },
    })(Menu);

    return (
        <>
            <StyledButton
                id={item}
                aria-controls={item}
                aria-haspopup="true"
                onClick={handleSubMenuClick}
                endIcon={anchorElSubmenu?.id === item ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
                <Typography>{i18n.t(item)}</Typography>
            </StyledButton>
            <StyledSubMenu
                anchorEl={anchorElSubmenu}
                open={anchorElSubmenu?.id === item}
                onClose={() => setAnchorElSubmenu(null)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: -40,
                    horizontal: "center",
                }}
            >
                {children}
            </StyledSubMenu>
        </>
    );
};

const StyledButton = styled(Button)`
    color: white;
    text-transform: capitalize;
    padding: 0px;
`;
