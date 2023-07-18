import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export interface SectionBlockProps {
    title: string;
    text: string;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({ title, text }) => {
    return (
        <ItemContent>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Description gutterBottom>{text}</Description>
        </ItemContent>
    );
};

const Description = styled(Typography)`
    font-weight: 300;
`;

const ItemContent = styled(Grid)`
    width: 400px;
`;
