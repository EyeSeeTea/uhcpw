import { Button, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import React from "react";

import { colors } from "../app/themes/dhis2.theme";
import { Layout } from "../../components/layout/Layout";
import i18n from "../../../locales";
import { useMethods } from "./useMethods";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { ColumnGridContainer } from "../../components/ColumnGridContainer";
import mapBackground from "../../assets/map-background.jpg";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { useReferenceLinks } from "../../common/hooks/analytics/useReferenceLinks";
import { getYouTubeEmbedUrl } from "../../../domain/entities/YouTubeVideo";
import { YouTubeVideoDialog } from "../../components/video-dialog/YouTubeVideoDialog";
import { Maybe } from "../../../types/utils";

const MethodsMarkdown = ({ children }: { children: string }) => {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => (
                    <Typography variant="body2" style={{ marginBottom: "10px" }}>
                        {children}
                    </Typography>
                ),
                ul: ({ children }) => <ul style={{ paddingLeft: "1.2em" }}>{children}</ul>,
                li: ({ children }) => (
                    <li>
                        <Typography variant="body2">{children}</Typography>
                    </li>
                ),
                a: ({ ...props }) => <MarkdownLink {...props} />,
            }}
        >
            {children}
        </ReactMarkdown>
    );
};

const MarkdownLink: React.FC<{
    href?: string | undefined;
    children: React.ReactNode;
}> = ({ href, children }) => {
    const { redirectWithExternalLink, sendEvent } = useAnalytics();
    const isSmallScreen = useIsSmallScreen();
    const [dialogTitle, setDialogTitle] = React.useState<Maybe<string>>(undefined);
    const embedUrl = href && !isSmallScreen ? getYouTubeEmbedUrl(href) : undefined;

    const openDialog = React.useCallback(
        (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            mouseEvent.preventDefault();
            const { href, innerText } = mouseEvent.currentTarget;
            sendEvent({ name: "external_link", href, text: innerText });
            setDialogTitle(innerText);
        },
        [sendEvent]
    );
    const closeDialog = React.useCallback(() => setDialogTitle(undefined), []);

    return (
        <>
            <TextLink
                href={href}
                style={{ paddingInline: 0 }}
                target="_blank"
                rel="noreferrer"
                onClick={embedUrl ? openDialog : redirectWithExternalLink}
            >
                {children}
            </TextLink>

            {embedUrl && (
                <YouTubeVideoDialog
                    open={dialogTitle !== undefined}
                    title={dialogTitle || ""}
                    embedUrl={embedUrl}
                    onClose={closeDialog}
                />
            )}
        </>
    );
};

export const MethodsPage: React.FC = () => {
    const { methods, isExpanded, setExpanded } = useMethods();
    const { sendPageView } = useAnalytics();

    const { abbreviationsLink, glossaryLink } = useReferenceLinks();

    const handleClick = (index: number) => {
        const updatedExpanded = [...isExpanded];
        updatedExpanded[index] = !updatedExpanded[index];
        setExpanded(updatedExpanded);
    };

    React.useEffect(() => {
        sendPageView({ title: "Methods" });
    }, [sendPageView]);

    return (
        <Layout>
            <TitleContainer aria-label="methods-page-header">
                <Typography variant="h3">{i18n.t("Methods")}</Typography>
            </TitleContainer>

            <MainContainer>
                <ColumnGridContainer spacing={5} aria-label="methods-container" columns={2}>
                    {methods.map((method, i) => (
                        <Grid item xs={12} key={method.sectionName} aria-label="method-item">
                            <Typography variant="h5" style={{ marginBottom: "10px" }}>
                                {method.sectionName}
                            </Typography>

                            {isExpanded[i] === false ? (
                                <TextContainer>
                                    <MethodsMarkdown>{method.shortText}</MethodsMarkdown>

                                    <StyledReadMoreButton endIcon={<ExpandMoreIcon />} onClick={() => handleClick(i)}>
                                        {i18n.t("Read more")}
                                    </StyledReadMoreButton>
                                </TextContainer>
                            ) : (
                                <TextContainer>
                                    <MethodsMarkdown>{method.text}</MethodsMarkdown>

                                    <StyledReadMoreButton endIcon={<ExpandLessIcon />} onClick={() => handleClick(i)}>
                                        {i18n.t("Read less")}
                                    </StyledReadMoreButton>
                                </TextContainer>
                            )}
                        </Grid>
                    ))}

                    <ButtonsGridItem item xs={12} sm={6} aria-label="methods-buttons">
                        <DownloadLink {...abbreviationsLink}>{i18n.t("Abbreviations")}</DownloadLink>

                        <DownloadLink {...glossaryLink}>{i18n.t("Glossary")}</DownloadLink>
                    </ButtonsGridItem>
                </ColumnGridContainer>
            </MainContainer>
        </Layout>
    );
};

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 24px 200px 24px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${props => props.color} url(${mapBackground});
        background-position: center;
    }
`;

const ButtonsGridItem = styled(Grid)`
    display: flex;
    height: max-content;
    gap: 20px;
`;

const StyledReadMoreButton = styled(Button)`
    text-transform: none;
    color: ${colors.accentPrimary};
    font-weight: bold;
    margin-left: -8px;
    padding: 0;
    margin: 0;
    :hover {
        background-color: transparent;
    }
    .MuiButton-endIcon {
        margin-inline-start: 4px;
        position: relative;
        inset-block-end: 2px;
    }
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    padding: 0 3px;
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const TextContainer = styled.div`
    width: 95%;
`;

const MainContainer = styled.div`
    padding: 80px 64px;

    @media (max-width: 600px) {
        padding: 40px;
    }
`;

const DownloadLink = styled.a`
    border-radius: 20px;
    color: white;
    background-color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    font-size: 14px;
    line-height: 2;
    padding: 5px 15px;
    &:hover {
        background-color: ${colors.accentPrimary};
        opacity: 0.5;
    }
`;
