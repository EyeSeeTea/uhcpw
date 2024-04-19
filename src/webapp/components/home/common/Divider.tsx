import styled from "styled-components";
import { Divider as DividerComponent } from "material-ui";
import { CountryStatus } from "../../../../domain/entities/Country";
import { getBackgroundColorByCountryStatus } from "../../../pages/country/utils";

type DividerProps = {
    countryStatus?: CountryStatus;
};

export const Divider: React.FC<DividerProps> = ({ countryStatus }) => <StyledDivider $countryStatus={countryStatus} />;

const StyledDivider = styled(DividerComponent)<{ $countryStatus?: CountryStatus }>`
    border-width: 20px;
    height: 20px !important;
    background: ${props =>
        props?.$countryStatus
            ? getBackgroundColorByCountryStatus(props?.$countryStatus)
            : "linear-gradient(90deg, #FF9355 1.8%, #FFBC88 100%)"};
`;
