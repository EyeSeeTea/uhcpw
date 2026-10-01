import React, { useCallback, useEffect, useState } from "react";
import { MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { YouTubeVideoDialog } from "@shared/webapp/components/video-dialog/YouTubeVideoDialog";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "@shared/webapp/common/hooks/screen/useIsSmallScreen";
import { muiTheme } from "@shared/webapp/pages/app/themes/dhis2.theme";

type OpenVideo = Readonly<{ title: string; embedUrl: string }>;

const smallScreenQuery = `(max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px)`;

export const MethodsYouTubeDialog: React.FC = () => {
    const [video, setVideo] = useState<OpenVideo | undefined>(undefined);

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const link = event.target instanceof Element ? event.target.closest("a[data-youtube-embed]") : null;
            const embedUrl = link?.getAttribute("data-youtube-embed");
            if (!link || !embedUrl || window.matchMedia(smallScreenQuery).matches) return;

            event.preventDefault();
            setVideo({ title: link.textContent?.trim() || "", embedUrl });
        };

        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    const closeDialog = useCallback(() => setVideo(undefined), []);

    return video ? (
        <StylesProvider injectFirst>
            <MuiThemeProvider theme={muiTheme}>
                <YouTubeVideoDialog open title={video.title} embedUrl={video.embedUrl} onClose={closeDialog} />
            </MuiThemeProvider>
        </StylesProvider>
    ) : null;
};
