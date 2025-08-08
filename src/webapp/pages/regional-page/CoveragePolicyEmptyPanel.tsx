import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

type CoveragePolicyEmptyPanelProps = {};

export const CoveragePolicyEmptyPanel: React.FC<CoveragePolicyEmptyPanelProps> = () => {
    return (
        <Container>
            <CircularProgress />
        </Container>
    );
};

const Container = styled.div`
    padding: 50px;
`;
