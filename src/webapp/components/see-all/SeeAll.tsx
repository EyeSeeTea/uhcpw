import { Button, Typography } from "@material-ui/core";
import i18n from "../../../locales";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useMemo } from "react";
import { colors } from "../../pages/app/themes/dhis2.theme";
import styled from "styled-components";

interface SeeAllProps {
    onClick: () => void;
    textColor?: "blue" | "white";
}

export const SeeAll: React.FC<SeeAllProps> = ({ onClick, textColor }) => {
    const color = useMemo(() => (textColor === "blue" ? colors.accentPrimary : colors.white), [textColor]);

    return (
        <Button variant="text" style={{ textTransform: "none" }} onClick={onClick}>
            <Title variant="caption" htmlColor={color}>
                {i18n.t("See All")}
            </Title>
            <ArrowForwardIcon fontSize="small" htmlColor={color} />
        </Button>
    );
};

const Title = styled(Typography)<{ htmlColor: string }>`
    color: ${props => props.htmlColor};
`;
