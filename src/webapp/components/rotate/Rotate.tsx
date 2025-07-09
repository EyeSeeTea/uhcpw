import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { useOrientation } from "./useOrientation";

type Props = {
    children: React.ReactNode;
    enableRotation?: boolean;
    width?: string;
    height?: string;
};

export const Rotate: React.FC<Props> = ({ children, enableRotation, width, height }) => {
    const orientation = useOrientation();
    const rotate = useMemo(() => {
        return enableRotation === true && orientation === "portrait";
    }, [enableRotation, orientation]);

    return (
        <RotatedContent rotate={rotate} width={width} height={height}>
            {children}
        </RotatedContent>
    );
};

const RotatedContent = styled.div<{ rotate: boolean; width?: string; height?: string }>`
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
    overflow: auto;

    ${({ rotate, width, height }) =>
        rotate &&
        css`
            transform: rotate(90deg);
            transform-origin: center;
            width: ${width || "100vh"};
            height: ${height || "100vw"};
            position: absolute;
            top: 50%;
            left: 50%;
            translate: -50% -50%;
        `}
`;
