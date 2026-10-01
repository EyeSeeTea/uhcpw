import { CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { ExplainerVideoState } from "./useExplainerVideo";

type ExplainerVideoProps = {
    state: ExplainerVideoState;
};

export const ExplainerVideo: React.FC<ExplainerVideoProps> = React.memo(({ state }) => {
    if (state.kind === "loading") {
        return (
            <Message>
                <CircularProgress style={{ color: colors.accentPrimary }} />
            </Message>
        );
    }

    if (state.kind === "error") {
        return (
            <Message>
                <Typography color="error">{i18n.t("The video could not be loaded")}</Typography>
            </Message>
        );
    }

    return <Video src={state.videoUrl} controls playsInline autoPlay />;
});

const Message = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
`;

const Video = styled.video`
    display: block;
    width: 100%;
    max-height: 70vh;
    background-color: black;
`;
