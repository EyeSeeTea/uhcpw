import React, { useCallback, useState } from "react";
import { Explainer } from "../../../domain/entities/explainers/Explainer";
import i18n from "../../../locales";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { FullScreenVideoDialog } from "../video-dialog/FullScreenVideoDialog";
import { VideoDialog } from "../video-dialog/VideoDialog";
import { VideoEmbed } from "../video-embed/VideoEmbed";
import { VideoPillButton, VideoPillVariant } from "../video-pill/VideoPill";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { ExplainerVideoFile } from "./ExplainerVideoFile";
import { useExplainerVideoFile } from "./useExplainerVideoFile";

type ExplainerVideoButtonProps = {
    explainer: Explainer;
    smallScreenVariant?: VideoPillVariant;
};

export const ExplainerVideoButton: React.FC<ExplainerVideoButtonProps> = React.memo(
    ({ explainer, smallScreenVariant }) => {
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const { clickWithPageView } = useAnalytics();
        const { page } = explainer;
        const isSmallScreen = useIsSmallScreen();

        // NOTICE: the video file is downloaded only when the dialog is opened. Its state lives here, not in the dialog,
        // so the downloaded video is kept while the user stays in the page even if the dialog is closed
        const videoFileState = useExplainerVideoFile(page, isDialogOpen && explainer.video.type === "file");

        const openDialog = useCallback(
            () => clickWithPageView({ title: `[Video] Explainer video: ${page}` }, () => setIsDialogOpen(true)),
            [clickWithPageView, page]
        );
        const closeDialog = useCallback(() => setIsDialogOpen(false), []);

        const label = i18n.t("Explainer video");
        const Dialog = isSmallScreen ? FullScreenVideoDialog : VideoDialog;

        return (
            <>
                <VideoPillButton
                    label={label}
                    variant={(isSmallScreen && smallScreenVariant) || "filled"}
                    onClick={openDialog}
                />

                <Dialog open={isDialogOpen} title={label} onClose={closeDialog}>
                    {explainer.video.type === "file" ? (
                        <ExplainerVideoFile state={videoFileState} />
                    ) : (
                        <VideoEmbed src={explainer.video.url} title={label} />
                    )}
                </Dialog>
            </>
        );
    }
);
