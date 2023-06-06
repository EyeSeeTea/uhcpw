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
            ? "linear-gradient(90deg, #FF9355 1.8%, #FFBC88 100%)"
            : "linear-gradient(89.98deg, #008AD7 66.78%, rgba(0, 138, 215, 0.3) 115.99%)"};
`;
