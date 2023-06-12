import { ChevronRight } from "@material-ui/icons/";
import { IconButton } from "material-ui";
import styled from "styled-components";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { useHistory } from "react-router-dom";

type ChevronRightIconType = {
    link?: string;
};

export const ChevronRightIcon: React.FC<ChevronRightIconType> = ({ link }) => {
    const history = useHistory();
    return (
        <StyledIconButton onClick={() => link && history.push(link)}>
            <ChevronRight style={{ backgroundColor: "blue" }} />
        </StyledIconButton>
    );
};

const StyledIconButton = styled(IconButton)`
    .MuiSvgIcon-root {
        background-color: ${colors.accentPrimary};
        border-radius: 50%;
        color: white;
    }
`;
