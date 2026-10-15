import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import i18n from "../../../../locales";
import { OfficeInfo } from "../../../../domain/entities/about/OfficeInfo";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { getYouTubeEmbedUrl } from "../../../../domain/entities/YouTubeVideo";
import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { YouTubeVideoDialog } from "../../video-dialog/YouTubeVideoDialog";
import { YouTubeEmbed } from "../../youtube-embed/YouTubeEmbed";

const videoPageView = { title: "[Video] WHO Barcelona Office" };

export const Header: React.FC<{ officeInfo: OfficeInfo | undefined }> = React.memo(({ officeInfo }) => {
    const { redirectWithPageView, clickWithPageView } = useAnalytics();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const isSmallScreen = useIsSmallScreen();
    const embedUrl = officeInfo?.officeVideo ? getYouTubeEmbedUrl(officeInfo.officeVideo) : undefined;

    const openDialog = React.useCallback(
        (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            mouseEvent.preventDefault();
            clickWithPageView(videoPageView, () => setIsDialogOpen(true));
        },
        [clickWithPageView]
    );
    const closeDialog = React.useCallback(() => setIsDialogOpen(false), []);

    if (!officeInfo) return null;

    const caption = i18n.t("WHO Barcelona Office for Health Systems Financing");

    return (
        <HeaderGrid container spacing={5} alignItems="flex-start">
            <Grid item md={6} xs={12}>
                {isSmallScreen && embedUrl ? (
                    <OfficeVideo src={embedUrl} title={caption} />
                ) : (
                    <a
                        href={officeInfo.officeVideo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={embedUrl ? openDialog : redirectWithPageView(videoPageView)}
                    >
                        <img
                            style={{ paddingBlockStart: "16px" }}
                            width="100%"
                            alt="WHO Barcelona Office"
                            src={officeInfo.officeImage}
                        />
                    </a>
                )}
                <Caption role="caption">{caption}</Caption>

                {!isSmallScreen && embedUrl && (
                    <YouTubeVideoDialog open={isDialogOpen} title={caption} embedUrl={embedUrl} onClose={closeDialog} />
                )}
            </Grid>
            <Grid item md={6} xs={12}>
                <Container maxWidth="sm">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <Text>{children}</Text>,
                        }}
                    >
                        {i18n.t(officeInfo.officeText)}
                    </ReactMarkdown>
                </Container>
            </Grid>
        </HeaderGrid>
    );
});

const HeaderGrid = styled(Grid)`
    margin-top: 0px;
    color: white;
    padding: 32px;
`;

const OfficeVideo = styled(YouTubeEmbed)`
    margin-block-start: 16px;
`;

const Caption = styled(Typography)`
    font-weight: 300;
    margin-top: 20px;
`;

const Text = styled(Typography)`
    font-weight: 300;
    margin-block-start: 1em;
    margin-block-end: 1em;
`;
