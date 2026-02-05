import { Chip } from "@material-ui/core";
import styled from "styled-components";

export const SelectedChip = styled(Chip)`
    border-radius: 20px;
    background: #cfe9f7;
    border: none;
    margin: 1px;
    max-width: 100%;
    min-height: 32px;
    height: fit-content;
    padding-block: 3px;

    > span {
        white-space: wrap;
    }
`;
