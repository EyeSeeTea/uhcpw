import React from "react";
import { YouTubeEmbed } from "../youtube-embed/YouTubeEmbed";
import { VideoDialog } from "./VideoDialog";

type YouTubeVideoDialogProps = {
    open: boolean;
    title: string;
    embedUrl: string;
    onClose: () => void;
};

export const YouTubeVideoDialog: React.FC<YouTubeVideoDialogProps> = ({ open, title, embedUrl, onClose }) => (
    <VideoDialog open={open} title={title} onClose={onClose}>
        <YouTubeEmbed src={`${embedUrl}?autoplay=1`} title={title} />
    </VideoDialog>
);
