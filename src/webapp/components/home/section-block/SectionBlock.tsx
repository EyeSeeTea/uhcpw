import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export interface SectionBlockProps {
    title: string;
    textList: string[];
}

export const SectionBlock: React.FC<SectionBlockProps> = ({ title, textList }) => {
    return (
        <ItemContent>
            <Title variant="h6" gutterBottom>
                {title}
            </Title>
            {textList.map((text, index) => {
                return (
                    <Typography key={index} gutterBottom>
                        {text}
                    </Typography>
                );
            })}
        </ItemContent>
    );
};

const Title = styled(Typography)`
    font-weight: bold;
`;

const ItemContent = styled(Grid)`
    width: 430px;
    margin: 64px 80px;
`;
