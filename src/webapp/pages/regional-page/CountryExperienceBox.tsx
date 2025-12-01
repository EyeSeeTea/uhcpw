import React, { useCallback, useState } from "react";
import { Button, IconButton, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import ReactMarkdown, { Components } from "react-markdown";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import i18n from "../../../locales";
import { colors } from "../app/themes/dhis2.theme";
import { FullScreenNotesDialog } from "../../components/dialog/FullScreenNotesDialog";
import { NotesDialog } from "../../components/dialog/NotesDialog";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";

type CountryExperienceBoxProps = {
    countryName: string;
    title: string;
    content: string;
    reference: string;
    showDialogInFullScreen?: boolean;
    disableGoToCountryPage?: boolean;
};

export const CountryExperienceBox: React.FC<CountryExperienceBoxProps> = props => {
    const {
        countryName,
        title,
        content,
        reference,
        showDialogInFullScreen = false,
        disableGoToCountryPage = false,
    } = props;
    const history = useHistory();
    const { redirectWithExternalLink } = useAnalytics();

    const [showReferences, setShowReferences] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Paragraph variant="body1" gutterBottom>
                    {children}
                </Paragraph>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
            a: ({ ...props }) => (
                <TextLink href={props.href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
                    {props.children}
                </TextLink>
            ),
        }),
        [redirectWithExternalLink]
    );

    const onCountryLinkClick = useCallback(() => {
        const countryNameInFilter = formatCountryOrRegionParamName(countryName);
        history.push(`/${countryNameInFilter}`);
    }, [countryName, history]);

    return (
        <CountryExperienceContent>
            <TitleContainer>
                <StyledTitle variant="h6" gutterBottom>
                    {title}
                </StyledTitle>

                {expanded && (
                    <StyledIconButton onClick={() => setShowReferences(true)}>
                        <CustomInfoIconCountry color="primary" className="info-button" />
                    </StyledIconButton>
                )}
            </TitleContainer>

            {expanded ? (
                <Content>
                    <ReactMarkdownContainer>
                        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
                    </ReactMarkdownContainer>
                    <StyledReadMoreButton
                        endIcon={<ExpandLessIcon />}
                        onClick={() => setExpanded(false)}
                        style={{ paddingBlockStart: "0" }}
                    >
                        {i18n.t("Read less")}
                    </StyledReadMoreButton>
                </Content>
            ) : (
                <StyledReadMoreButton endIcon={<ExpandMoreIcon />} onClick={() => setExpanded(true)}>
                    {i18n.t("Read more")}
                </StyledReadMoreButton>
            )}

            {!disableGoToCountryPage && (
                <StyledLink
                    variant="text"
                    onClick={onCountryLinkClick}
                    aria-label={`Go to ${countryName} country page`}
                >
                    {i18n.t("See {{countryName}} country page", { countryName: countryName })}
                </StyledLink>
            )}

            {showReferences &&
                (showDialogInFullScreen ? (
                    <FullScreenNotesDialog
                        isOpen={showReferences}
                        onClose={() => setShowReferences(false)}
                        dialogInfo={reference}
                    />
                ) : (
                    <NotesDialog
                        isOpen={showReferences}
                        onClose={() => setShowReferences(false)}
                        dialogInfo={reference}
                    />
                ))}
        </CountryExperienceContent>
    );
};

const Content = styled.div`
    padding: 16px 16px 0px 0;
    color: ${colors.black};
    font-size: 16px;
`;

const ReactMarkdownContainer = styled.div`
    p:has(+ ul) {
        margin-bottom: 0;
    }
`;

const CountryExperienceContent = styled.div`
    padding: 20px;
    margin-bottom: 24px;
    background-color: ${colors.blue10};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const StyledTitle = styled(Typography)`
    color: ${colors.black};
    margin-bottom: 0;

    &.MuiTypography-h6 {
        font-size: 16px;
        font-weight: bold;
    }
`;

const Paragraph = styled(Typography)`
    font-family: Lato;
    margin-block: 10px;
    font-size: 16px;
    color: ${colors.black};

    &:first-child {
        margin-block-start: 0;
    }

    &:last-child {
        margin-block-end: 0;
    }
`;

const StyledLi = styled.li`
    line-height: 1.43;
    color: ${colors.black};
    font-size: 16px;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
    color: ${colors.black};
    font-size: 16px;
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    font-size: 16px;
    &:hover {
        text-decoration: underline;
    }
`;

const StyledLink = styled(Button)`
    font-size: 16px;
    padding-left: 0;
    padding-block-start: 0;
    span {
        color: ${colors.darkBlue};
        text-decoration: none;
        text-transform: none;
    }
`;

const StyledIconButton = styled(IconButton)`
    padding-inline: 4px;
    padding-block: 0;
    color: ${colors.darkBlue};
`;

const CustomInfoIconCountry = styled(InfoIcon)`
    color: ${colors.darkBlue};
    font-size: 25px;
`;

const StyledReadMoreButton = styled(Button)<{ marginLeft?: string }>`
    text-transform: none;
    color: ${colors.darkBlue};
    font-size: 16px;
    padding: 0;
    margin: 0;
    margin-left: ${props => props.marginLeft || "0"};
    padding-block-start: 6px;
    margin-block-end: 6px;

    :hover {
        background-color: transparent;
    }
    .MuiButton-endIcon {
        margin-inline-start: 4px;
        position: relative;
        inset-block-end: 2px;
    }
`;

const TitleContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin-block-start: 6px;
`;
