import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { useOrientation } from "./useOrientation";

type Props = {
    children: React.ReactNode;
};

export const Rotate: React.FC<Props> = ({ children }) => {
    const orientation = useOrientation();
    const isPortrait = useMemo(() => {
        return orientation === "portrait";
    }, [orientation]);

    return <RotatedContent isPortrait={isPortrait}>{children}</RotatedContent>;
};

const RotatedContent = styled.div<{ isPortrait: boolean }>`
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;

    ${({ isPortrait }) =>
        isPortrait &&
        css`
            transform: rotate(-90deg);
            transform-origin: center;
            width: 100vh;
            height: 100vw;
            position: absolute;
            top: 50%;
            left: 50%;
            translate: -50% -50%;
        `}
`;
