import React from "react";
import { Button, Link } from "@material-ui/core";
import styled from "styled-components";
import { NewsletterContent } from "../../../../domain/entities/HomePageContent";

type NewsletterButtonProps = { content: NewsletterContent };

export const NewsletterButton: React.FC<NewsletterButtonProps> = ({ content }) => {
    return (
        <Link target="_blank" href={content.buttonLink}>
            <StyledButton variant="outlined">{content.buttonText}</StyledButton>
        </Link>
    );
};

const StyledButton = styled(Button)`
    position: fixed;
    inset-block-end: 0;
    inset-inline-end: 20%;
    z-index: 1800;
    border-color: #ff8d4e;
    background-color: #ff8d4e;
    border-radius: 4px 4px 0 0;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1), -2px 0 4px rgba(0, 0, 0, 0.1), 2px 0 4px rgba(0, 0, 0, 0.1);
    color: white;
    :hover {
        background: #ff5c01;
        border-color: #ff5c01;
    }
    text-transform: unset;
`;
