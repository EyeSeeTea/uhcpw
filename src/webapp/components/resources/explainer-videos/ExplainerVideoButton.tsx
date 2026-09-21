import React, { useCallback, useState } from "react";
import i18n from "../../../../locales";
import { VideoPillButton } from "../../video-pill/VideoPill";
import { ExplainerVideo } from "./ExplainerVideo";
import { ExplainerVideoDialog } from "./ExplainerVideoDialog";
import { useExplainerInfo } from "./useExplainerInfo";

export const ExplainerVideoButton: React.FC = React.memo(() => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // NOTICE: the explainer state lives here, not in the dialog, so the downloaded video is kept while the user stays
    // in the resources page even if the dialog is closed
    const explainerInfoState = useExplainerInfo(isDialogOpen);

    const openDialog = useCallback(() => setIsDialogOpen(true), []);
    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    const label = i18n.t("Explainer Video");

    return (
        <>
            <VideoPillButton label={label} onClick={openDialog} />

            <ExplainerVideoDialog open={isDialogOpen} title={label} onClose={closeDialog}>
                <ExplainerVideo state={explainerInfoState} />
            </ExplainerVideoDialog>
        </>
    );
});
