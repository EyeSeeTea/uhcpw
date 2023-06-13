import { Typography } from "@material-ui/core";
import styled from "styled-components";

type TagProps = {
    theme: string;
    color?: string;
};

export const Tag: React.FC<TagProps> = ({ theme, color }) => {
    return (
        <Container background={color}>
            <Typography variant="body2" style={{ color: "white" }} align="center">
                {theme}
            </Typography>
        </Container>
    );
};

const Container = styled.div<{ background?: string }>`
    border-radius: 20px;
    background: ${props => props.background || "#185698"};
    color: #174587;
    padding: 4px 16px;
    display: inline-block;
    margin-right: 16px;
    margin-bottom: 8px;
`;
