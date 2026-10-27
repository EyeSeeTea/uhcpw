import React from "react";
import styled from "styled-components";
import { FullScreenDialog } from "../dialog/FullScreenDialog";
import { VideoDialogProps, VideoDialogTitle } from "./VideoDialog";

// NOTICE: onClose is not passed to FullScreenDialog because it would add its "Save" button; the title bar closes it
export const FullScreenVideoDialog: React.FC<VideoDialogProps> = ({ open, title, onClose, children }) => (
    <FullScreenDialog isOpen={open} forceRotation hasPadding={false} recalculateHeight>
        <Layout>
            <CompactTitle title={title} onClose={onClose} />
            <Video>{children}</Video>
        </Layout>
    </FullScreenDialog>
);

const CompactTitle = styled(VideoDialogTitle)`
    && {
        padding-block: 8px;
    }

    .MuiIconButton-root {
        padding: 8px;
    }
`;

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const framePx = 24;

// NOTICE: the video fills the space left by the title bar instead of keeping the 16:9 box of the windowed dialog.
// It is absolutely positioned so its size never depends on the natural size of the video file.
const Video = styled.div`
    position: relative;
    flex: 1;
    min-height: 0;

    && > * {
        position: absolute;
        top: 0;
        left: ${framePx}px;
        width: calc(100% - ${framePx * 2}px);
        height: calc(100% - ${framePx}px);
        max-height: none;
        aspect-ratio: auto;
        object-fit: contain;
        background-color: black;
    }
`;
