import React from "react";
import styled from "styled-components";
import { AppFooter } from "./app-footer/AppFooter";
import { AppHeader } from "./app-header/AppHeader";
import { CookiesDisclaimer } from "./cookies-disclaimer/CookiesDisclaimer";

interface LayoutProps {
    headerAction?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = React.memo(({ headerAction, children }) => {
    return (
        <>
            <header>
                <AppHeader action={headerAction} />
            </header>

            <Main>{children}</Main>

            <footer>
                <CookiesDisclaimer />
                <AppFooter />
            </footer>
        </>
    );
});

const Main = styled.main`
    min-height: 100vh;
    background: white;
`;
