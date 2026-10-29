import { CircularProgress, Typography } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { ExplainerVideoFileState } from "./useExplainerVideoFile";

type ExplainerVideoFileProps = {
    state: ExplainerVideoFileState;
};

export const ExplainerVideoFile: React.FC<ExplainerVideoFileProps> = React.memo(({ state }) => {
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

    return <VideoPlayer file={state.videoFile.file} />;
});

const VideoPlayer: React.FC<{ file: Blob }> = ({ file }) => {
    const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => () => URL.revokeObjectURL(videoUrl), [videoUrl]);

    return <Video src={videoUrl} controls playsInline autoPlay />;
};

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
