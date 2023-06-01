import React from "react";
import styled from "styled-components";
import { AppFooter } from "./app-footer/AppFooter";
import { AppHeader } from "./app-header/AppHeader";

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
                <AppFooter />
            </footer>
        </>
    );
});

const Main = styled.main`
    min-height: 100vh;
    background: white;
`;
