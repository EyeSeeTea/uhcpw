import styled from "styled-components";
import { Divider as DividerComponent } from "material-ui";

type DividerProps = {
    isOrange?: boolean;
};

export const Divider: React.FC<DividerProps> = ({ isOrange = true }) => <StyledDivider isOrange={isOrange} />;

const StyledDivider = styled(DividerComponent)<{ isOrange: boolean }>`
    border-width: 20px;
    height: 20px !important;
    background: ${props =>
        props.isOrange
            ? "linear-gradient(90deg, rgba(255, 140, 0, 1) 0%, rgba(255, 191, 113, 1) 100%)"
            : "linear-gradient(90deg, rgba(0,61,255,1) 0%, rgba(74,117,255,1) 100%)"};
`;
