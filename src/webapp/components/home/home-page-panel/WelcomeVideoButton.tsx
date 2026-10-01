import React, { useCallback, useState } from "react";
import { getYouTubeEmbedUrl } from "../../../../domain/entities/YouTubeVideo";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { VideoDialog } from "../../video-dialog/VideoDialog";
import { VideoPillButton, VideoPillLink } from "../../video-pill/VideoPill";
import { YouTubeEmbed } from "../../youtube-embed/YouTubeEmbed";

type WelcomeVideoButtonProps = {
    link: string;
    text: string;
};

export const WelcomeVideoButton: React.FC<WelcomeVideoButtonProps> = React.memo(({ link, text }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { clickWithPageView, redirectWithPageView } = useAnalytics();
    const embedUrl = getYouTubeEmbedUrl(link);
    const pageViewTitle = `[Video] ${text}`;

    const openDialog = useCallback(
        () => clickWithPageView({ title: pageViewTitle }, () => setIsDialogOpen(true)),
        [clickWithPageView, pageViewTitle]
    );
    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    if (!embedUrl) {
        return (
            <VideoPillLink
                href={link}
                target="_blank"
                rel="noreferrer"
                onClick={redirectWithPageView({ title: pageViewTitle })}
                label={text}
            />
        );
    }

    return (
        <>
            <VideoPillButton label={text} onClick={openDialog} />

            <VideoDialog open={isDialogOpen} title={text} onClose={closeDialog}>
                <YouTubeEmbed src={`${embedUrl}?autoplay=1`} title={text} />
            </VideoDialog>
        </>
    );
});
