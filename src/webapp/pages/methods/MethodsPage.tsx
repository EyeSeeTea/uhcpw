import { Button, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../app/themes/dhis2.theme";
import { Layout } from "../../components/layout/Layout";
import bubblePattern from "../../assets/bubble-pattern-white.png";
import i18n from "../../../locales";
import { useMethods } from "./useMethods";
import ReactMarkdown from "react-markdown";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import React from "react";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

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
    const { redirectWithExternalLink } = useAnalytics();

    return (
        <TextLink
            href={href}
            style={{ paddingInline: 0 }}
            target="_blank"
            rel="noreferrer"
            onClick={redirectWithExternalLink}
        >
            {children}
        </TextLink>
    );
};

export const MethodsPage: React.FC = () => {
    const { methods, isExpanded, setExpanded } = useMethods();
    const { sendPageView, redirectWithPageView } = useAnalytics();

    const handleClick = (index: number) => {
        const updatedExpanded = [...isExpanded];
        updatedExpanded[index] = !updatedExpanded[index];
        setExpanded(updatedExpanded);
    };

    React.useEffect(() => {
        sendPageView({ title: "Methods" });
    }, [sendPageView]);

    const abbreviationsPageView = redirectWithPageView({ title: "Abbreviations" });
    const glossaryPageView = redirectWithPageView({ title: "Glossary" });

    return (
        <Layout>
            <TitleContainer aria-label="methods-page-header">
                <Typography variant="h3">{i18n.t("Methods")}</Typography>
            </TitleContainer>
            <MainContainer>
                <Grid container spacing={5} aria-label="methods-container">
                    {methods.map((method, i) => (
                        <Grid item xs={12} sm={6} key={method.sectionName} aria-label="method-item">
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
                        <DownloadLink
                            target="_blank"
                            href="https://cmyn.short.gy/abbreviations"
                            onClick={abbreviationsPageView}
                        >
                            {i18n.t("Abbreviations")}
                        </DownloadLink>
                        <DownloadLink target="_blank" href="https://cmyn.short.gy/glossary" onClick={glossaryPageView}>
                            {i18n.t("Glossary")}
                        </DownloadLink>
                    </ButtonsGridItem>
                </Grid>
            </MainContainer>
        </Layout>
    );
};

const TitleContainer = styled.div`
    background: url(${bubblePattern}) no-repeat right top;
    background-color: ${colors.accentPrimary};
    color: white;
    padding: 48px 200px 48px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    width: 70%;
`;

const MainContainer = styled.div`
    padding: 80px 64px;
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
