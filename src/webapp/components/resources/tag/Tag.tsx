import { Button, Typography } from "@material-ui/core";
import { MouseEventHandler } from "react";
import styled from "styled-components";

type TagProps = {
    theme: string;
    color?: string;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export const Tag: React.FC<TagProps> = ({ theme, color, onClick }) => {
    return (
        <Container background={color} onClick={onClick}>
            <Typography variant="body2" style={{ color: "white" }} align="center">
                {theme}
            </Typography>
        </Container>
    );
};

const Container = styled(Button)<{ background?: string }>`
    border-radius: 20px;
    background: ${props => props.background || "#185698"};
    color: #174587;
    padding: 4px 16px;
    display: inline-block;
    margin-right: 16px;
    margin-bottom: 8px;
    text-transform: none;
    &:hover {
        background-color: ${props => props.background || "#185698"};
        opacity: 0.7;
    }
`;
