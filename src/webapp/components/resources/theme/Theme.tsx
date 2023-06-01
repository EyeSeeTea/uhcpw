import { Typography } from "@material-ui/core";
import styled from "styled-components";

type ThemeProps = {
    theme: string;
};

const themeColor: Record<string, string> = {
    "Financial Protection": "#008ad7",
    "Resilience and financial sustainability": "#4fad56",
    "Spending on Health": "#0360a7",
    "Voluntary Health Insurance": "#ff8d4e",
};

export const Theme: React.FC<ThemeProps> = ({ theme }) => {
    return (
        <Container background={themeColor[theme]}>
            <Typography variant="body2" style={{ color: "white" }} align="center">
                {theme}
            </Typography>
        </Container>
    );
};

const Container = styled.div<{ background?: string }>`
    border-radius: 20px;
    background: ${props => props.background || "red"};
    color: #174587;
    padding: 4px 16px;
    display: inline-block;
<<<<<<< HEAD
    margin-right: 16px;
    margin-bottom: 8px;
=======
>>>>>>> origin/development
`;
