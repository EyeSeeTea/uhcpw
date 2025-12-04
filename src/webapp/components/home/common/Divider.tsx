import styled from "styled-components";
import { Divider as DividerComponent } from "material-ui";
import { getBackgroundColorByFinancialProtectionStatus } from "../../../pages/country/utils";
import { FinancialProtectionStatus } from "../../../../domain/entities/FinancialProtectionStatus";

type DividerProps = {
    financialProtectionStatus?: FinancialProtectionStatus;
};

export const Divider: React.FC<DividerProps> = ({ financialProtectionStatus }) => (
    <StyledDivider $financialProtectionStatus={financialProtectionStatus} />
);

const StyledDivider = styled(DividerComponent)<{ $financialProtectionStatus?: FinancialProtectionStatus }>`
    border-width: 20px;
    height: 20px !important;
    background: ${props =>
        props?.$financialProtectionStatus
            ? getBackgroundColorByFinancialProtectionStatus(props?.$financialProtectionStatus)
            : "linear-gradient(90deg, #FF9355 1.8%, #FFBC88 100%)"};
`;
