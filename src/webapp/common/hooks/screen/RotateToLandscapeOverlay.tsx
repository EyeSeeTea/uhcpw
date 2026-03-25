import * as React from "react";
import styled, { keyframes } from "styled-components";

import { useOrientation } from "./useOrientation";
import i18n from "../../../../locales";
import { colors } from "../../../pages/app/themes/dhis2.theme";

type RotateToLandscapeOverlayProps = {
    message?: string;
    subMessage?: string;
};

export const RotateToLandscapeOverlay: React.FC<RotateToLandscapeOverlayProps> = (
    props: RotateToLandscapeOverlayProps
) => {
    const { message = i18n.t("Please rotate your device"), subMessage } = props;
    const orientation = useOrientation();

    const shouldShow = orientation === "portrait" && typeof window !== "undefined";

    if (!shouldShow) return null;

    return (
        <Overlay role="dialog" aria-modal="true">
            <AnimationContainer aria-hidden>
                <Phone />
            </AnimationContainer>

            <Text>
                <Title>{message}</Title>
                {subMessage && <Subtitle>{subMessage}</Subtitle>}
            </Text>
        </Overlay>
    );
};

const Overlay = styled.div`
    position: fixed;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
    top: 0;
    left: 0;
    width: 101vw;
    height: 100vh;
`;

const AnimationContainer = styled.div`
    position: relative;
    height: 120px;
    margin-bottom: 16px;
    display: grid;
    place-items: center;
`;

const rotateLandscape = keyframes`
  0% { transform: rotate(0deg); opacity: 0.5; }
  35% { transform: rotate(-90deg); opacity: 1; }
  70% { transform: rotate(-90deg); opacity: 1; }
  100% { transform: rotate(0deg); opacity: 0.5; }
`;

const Phone = styled.div`
    width: 170px;
    height: 96px;
    border-radius: 15px;
    border: 3px solid ${colors.blue};
    position: relative;
    animation: ${rotateLandscape} 3s ease-in-out infinite;
    transform-origin: 50% 50%;

    /* screen */
    &::before {
        content: "";
        position: absolute;
        inset: 8px;
        border-radius: 5px;
        background: ${colors.blue50};
        opacity: 0.2;
    }

    /* notch / camera */
    &::after {
        content: "";
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${colors.blue};
    }
`;

const Text = styled.div`
    text-align: center;
`;

const Title = styled.div`
    font-size: 18px;
    font-weight: 700;
    margin-block: 6px;
    margin-block-start: 24px;
    color: ${colors.white};
`;

const Subtitle = styled.div`
    font-size: 16px;
    color: ${colors.white};
    line-height: 1.35;
`;
