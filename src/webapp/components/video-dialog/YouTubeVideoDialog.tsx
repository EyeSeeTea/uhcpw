import React from "react";
import { VideoEmbed } from "../video-embed/VideoEmbed";
import { VideoDialog } from "./VideoDialog";

type YouTubeVideoDialogProps = {
    open: boolean;
    title: string;
    embedUrl: string;
    onClose: () => void;
};

export const YouTubeVideoDialog: React.FC<YouTubeVideoDialogProps> = ({ open, title, embedUrl, onClose }) => (
    <VideoDialog open={open} title={title} onClose={onClose}>
        <VideoEmbed src={`${embedUrl}?autoplay=1`} title={title} />
    </VideoDialog>
);
