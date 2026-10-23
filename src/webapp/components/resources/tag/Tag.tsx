import { Button, Typography } from "@material-ui/core";
import { MouseEventHandler } from "react";
import styled from "styled-components";

type TagProps = {
    theme: string;
    title?: string;
    color?: string;
    compact?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export const Tag: React.FC<TagProps> = ({ theme, title, color, compact = false, onClick }) => {
    return (
        <Container background={color} $compact={compact} onClick={onClick} title={title}>
            <Typography variant="body2" style={{ color: "white" }} align="center">
                {theme}
            </Typography>
        </Container>
    );
};

// Theme chips are compact in every resource category, so the two longest theme names ("Financing" and
// "Resilience") fit in one row of the 180px analysis cards.
const Container = styled(Button)<{ background?: string; $compact: boolean }>`
    border-radius: 20px;
    background: ${props => props.background || "#185698"};
    color: #174587;
    padding: ${props => (props.$compact ? "4px 8px" : "4px 16px")};
    display: inline-block;
    margin-inline-end: ${props => (props.$compact ? "8px" : "16px")};
    margin-block-end: 8px;
    text-transform: none;
    &:hover {
        background-color: ${props => props.background || "#185698"};
        opacity: 0.7;
    }
`;
