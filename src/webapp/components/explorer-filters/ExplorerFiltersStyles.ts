import { Button, Grid } from "@material-ui/core";
import styled from "styled-components";

// Same width for "Get table" and "Get chart", so the filters line up on both explorers
const GET_RESULTS_BUTTON_MIN_WIDTH = "120px";

export const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const GetResultsButton = styled(Button)<{ $isMobile: boolean }>`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    white-space: nowrap;
    background: #185698;
    width: ${({ $isMobile }) => ($isMobile ? "100%" : "auto")};
    min-width: ${GET_RESULTS_BUTTON_MIN_WIDTH};
    margin-block-start: ${({ $isMobile }) => ($isMobile ? "10px" : "0")};
`;

export const GetResultsButtonGridItem = styled(Grid)`
    text-align: end;
`;
