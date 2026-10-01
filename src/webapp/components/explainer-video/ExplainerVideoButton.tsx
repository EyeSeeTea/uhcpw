import React, { useCallback, useState } from "react";
import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import i18n from "../../../locales";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { VideoPillButton } from "../video-pill/VideoPill";
import { ExplainerVideo } from "./ExplainerVideo";
import { ExplainerVideoDialog } from "./ExplainerVideoDialog";
import { useExplainerVideo } from "./useExplainerVideo";

type ExplainerVideoButtonProps = {
    page: ExplainerPage;
};

export const ExplainerVideoButton: React.FC<ExplainerVideoButtonProps> = React.memo(({ page }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { clickWithPageView } = useAnalytics();

    // NOTICE: the video state lives here, not in the dialog, so the downloaded video is kept while the user stays
    // in the page even if the dialog is closed
    const videoState = useExplainerVideo(page, isDialogOpen);

    const openDialog = useCallback(
        () => clickWithPageView({ title: `[Video] Explainer video: ${page}` }, () => setIsDialogOpen(true)),
        [clickWithPageView, page]
    );
    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    const label = i18n.t("Explainer video");

    return (
        <>
            <VideoPillButton label={label} variant="filled" onClick={openDialog} />

            <ExplainerVideoDialog open={isDialogOpen} title={label} onClose={closeDialog}>
                <ExplainerVideo state={videoState} />
            </ExplainerVideoDialog>
        </>
    );
});
