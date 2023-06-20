import { Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { colors } from "../../../pages/app/themes/dhis2.theme";

type CTAProps = {
    text: string;
    link: string;
};

export const CTA: React.FC<CTAProps> = ({ text, link }) => {
    return (
        <Button
            component={NavLink}
            to={link}
            style={{
                borderRadius: "30px",
                background: "white",
                color: colors.accentPrimary,
                padding: "10px 40px",
                textTransform: "none",
            }}
        >
            {text}
        </Button>
    );
};
