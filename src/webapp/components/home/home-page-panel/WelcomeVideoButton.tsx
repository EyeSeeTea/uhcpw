import React, { useCallback, useState } from "react";
import { getYouTubeEmbedUrl } from "../../../../domain/entities/YouTubeVideo";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { YouTubeVideoDialog } from "../../video-dialog/YouTubeVideoDialog";
import { VideoPillButton, VideoPillLink } from "../../video-pill/VideoPill";

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

            <YouTubeVideoDialog open={isDialogOpen} title={text} embedUrl={embedUrl} onClose={closeDialog} />
        </>
    );
});
