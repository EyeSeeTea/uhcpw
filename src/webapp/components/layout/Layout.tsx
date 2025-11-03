import React from "react";
import styled from "styled-components";
import { AppFooter } from "./app-footer/AppFooter";
import { AppHeader } from "./app-header/AppHeader";
import { Rotate } from "../rotate/Rotate";

interface LayoutProps {
    headerAction?: React.ReactNode;
    enableRotation?: boolean;
    disableMinHeight?: boolean;
    isOverflowVisible?: boolean;
}

export const Layout: React.FC<LayoutProps> = React.memo(
    ({ headerAction, children, enableRotation = false, disableMinHeight = false, isOverflowVisible = false }) => {
        return (
            <Rotate enableRotation={enableRotation} isOverflowVisible={isOverflowVisible}>
                <header>
                    <AppHeader action={headerAction} isScreenRotated={enableRotation} />
                </header>

                <Main $disableMinHeight={disableMinHeight} $isOverflowVisible={isOverflowVisible}>
                    {children}
                </Main>

                <footer id="footer">
                    <AppFooter />
                </footer>
            </Rotate>
        );
    }
);

const Main = styled.main<{ $disableMinHeight: boolean; $isOverflowVisible: boolean }>`
    overflow: ${props => (props.$isOverflowVisible ? "visible" : "hidden")};
    min-height: ${props => (props.$disableMinHeight ? "0vh" : "100vh")};
    @media (max-width: 600px) {
        min-height: 0vh;
    }
    background: white;
`;
