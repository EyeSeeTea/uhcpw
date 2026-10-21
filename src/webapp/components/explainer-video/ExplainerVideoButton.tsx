import React, { useCallback, useState } from "react";
import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import i18n from "../../../locales";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { VideoDialog } from "../video-dialog/VideoDialog";
import { VideoEmbed } from "../video-embed/VideoEmbed";
import { VideoPillButton } from "../video-pill/VideoPill";
import { useExplainerVideoUrl } from "./useExplainerVideoUrl";

type ExplainerVideoButtonProps = {
    page: ExplainerPage;
};

export const ExplainerVideoButton: React.FC<ExplainerVideoButtonProps> = React.memo(({ page }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { clickWithPageView } = useAnalytics();
    const videoUrl = useExplainerVideoUrl(page);

    const openDialog = useCallback(
        () => clickWithPageView({ title: `[Video] Explainer video: ${page}` }, () => setIsDialogOpen(true)),
        [clickWithPageView, page]
    );
    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    const label = i18n.t("Explainer video");

    // NOTICE: the button is hidden while the URL loads and when the page has no explainer video configured
    if (!videoUrl) return null;

    return (
        <>
            <VideoPillButton label={label} variant="filled" onClick={openDialog} />

            <VideoDialog open={isDialogOpen} title={label} onClose={closeDialog}>
                <VideoEmbed src={videoUrl} title={label} />
            </VideoDialog>
        </>
    );
});
