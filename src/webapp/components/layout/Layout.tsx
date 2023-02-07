import React from "react";
import styled from "styled-components";
import { AppFooter } from "./app-footer/AppFooter";
import { AppHeader } from "./app-header/AppHeader";

export const Layout: React.FC = React.memo(({ children }) => {
    return (
        <>
            <header>
                <AppHeader />
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
`;
