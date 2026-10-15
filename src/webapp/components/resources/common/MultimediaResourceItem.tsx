import React, { useCallback, useMemo, useState } from "react";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { MultimediaState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { useDesktopYouTubeEmbedUrl } from "../../video-dialog/useDesktopYouTubeEmbedUrl";
import { YouTubeVideoDialog } from "../../video-dialog/YouTubeVideoDialog";
import { SimpleResourceItem, SimpleResourceItemProps } from "./SimpleResourceItem";

type MultimediaResourceItemProps = Omit<
    SimpleResourceItemProps,
    "title" | "url" | "image" | "fallbackImage" | "date" | "redirectWithEvent"
> & {
    resource: MultimediaState;
    analyticsPageTitle: string;
};

export const MultimediaResourceItem: React.FC<MultimediaResourceItemProps> = React.memo(
    ({ resource, analyticsPageTitle, ...itemProps }) => {
        const { redirectWithEvent, clickWithEvent } = useAnalytics();
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const embedUrl = useDesktopYouTubeEmbedUrl(resource.url);

        const analyticsEvent = useMemo(
            () => ({
                name: "resource" as const,
                pageTitle: analyticsPageTitle,
                year: resource.date.getFullYear(),
                resourceName: resource.title,
                category: resource.kind,
                theme: resource.themeName,
            }),
            [resource, analyticsPageTitle]
        );

        const openLink = useMemo(() => redirectWithEvent(analyticsEvent), [redirectWithEvent, analyticsEvent]);
        const openDialog = useCallback(
            (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                mouseEvent.preventDefault();
                clickWithEvent(analyticsEvent, () => setIsDialogOpen(true));
            },
            [clickWithEvent, analyticsEvent]
        );
        const closeDialog = useCallback(() => setIsDialogOpen(false), []);

        return (
            <>
                <SimpleResourceItem
                    {...itemProps}
                    title={resource.title}
                    url={resource.url}
                    image={resource.imageOriginal}
                    fallbackImage={resource.imageOriginal}
                    date={resource.date}
                    redirectWithEvent={embedUrl ? openDialog : openLink}
                />

                {embedUrl && (
                    <YouTubeVideoDialog
                        open={isDialogOpen}
                        title={resource.title}
                        embedUrl={embedUrl}
                        onClose={closeDialog}
                    />
                )}
            </>
        );
    }
);
