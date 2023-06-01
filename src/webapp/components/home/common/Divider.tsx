import styled from "styled-components";
import { Divider as DividerComponent } from "material-ui";

export const Divider: React.FC = () => <StyledDivider />;

const StyledDivider = styled(DividerComponent)`
    border-width: 20px;
    height: 20px !important;
    background: linear-gradient(90deg, rgba(255, 140, 0, 1) 0%, rgba(255, 191, 113, 1) 100%);
`;
