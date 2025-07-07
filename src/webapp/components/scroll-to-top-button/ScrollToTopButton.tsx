import React, { useEffect, useState } from "react";
import { KeyboardArrowUp } from "@material-ui/icons";
import styled from "styled-components";

import i18n from "../../../locales";
import { colors } from "../../pages/app/themes/dhis2.theme";

type ScrollToTopButtonProps = {
    threshold?: number;
};

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = props => {
    const { threshold = 200 } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [isFixed, setIsFixed] = useState(true);
    const [absoluteTop, setAbsoluteTop] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > threshold);

            const footer = document.getElementById("footer");

            if (footer) {
                const footerRect = footer.getBoundingClientRect();

                const windowHeight = window.innerHeight;

                if (footerRect.top < windowHeight) {
                    setIsFixed(false);
                    setAbsoluteTop(window.scrollY + footerRect.top);
                } else {
                    setIsFixed(true);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) {
        return null;
    }

    return (
        <StyledButton
            onClick={scrollToTop}
            aria-label={i18n.t("Back to top")}
            $absoluteTop={absoluteTop}
            $isFixed={isFixed}
        >
            <StyledButtonContent>
                <KeyboardArrowUp />
                {i18n.t("Back to top")}
            </StyledButtonContent>
        </StyledButton>
    );
};

const StyledButton = styled.button<{ $absoluteTop?: number; $isFixed?: boolean }>`
    position: ${props => (props.$isFixed ? "fixed" : "absolute")};
    bottom: 25px;
    right: 25px;
    width: fit-content;
    height: auto;
    box-shadow: none;
    border: none;
    z-index: 1000;
    background-color: transparent;
    color: ${colors.accentPrimary};
    font-weight: bold;
    padding: 0;
    text-transform: none;
    svg {
        font-size: 45px;
        color: white;
        background-color: ${colors.accentPrimary};
        border-radius: 50%;
    }
`;

const StyledButtonContent = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: column;
`;
