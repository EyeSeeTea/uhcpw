import React from "react";
import styled from "styled-components";
import { AppFooter } from "./app-footer/AppFooter";
import { AppHeader } from "./app-header/AppHeader";
import { Rotate } from "../rotate/Rotate";

interface LayoutProps {
    headerAction?: React.ReactNode;
    enableRotation?: boolean;
}

export const Layout: React.FC<LayoutProps> = React.memo(({ headerAction, children, enableRotation = false }) => {
    return (
        <Rotate enableRotation={enableRotation}>
            <header>
                <AppHeader action={headerAction} isScreenRotated={enableRotation} />
            </header>

            <Main>{children}</Main>

            <footer id="footer">
                <AppFooter />
            </footer>
        </Rotate>
    );
});

const Main = styled.main`
    min-height: 100vh;
    @media (max-width: 600px) {
        min-height: 0vh;
    }
    background: white;
`;
