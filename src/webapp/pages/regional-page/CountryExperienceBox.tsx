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
                <StyledText variant="body1" gutterBottom>
                    {children}
                </StyledText>
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
        history.push(`/country-page?country=${countryNameInFilter}`);
    }, [countryName, history]);

    return (
        <CountryExperienceContent>
            <StyledIconButton onClick={() => setShowReferences(true)} $color="#185698" padding="4px">
                <CustomInfoIconCountry color="primary" className="info-button" />
            </StyledIconButton>

            <StyledTitle variant="h6" gutterBottom>
                {title}
            </StyledTitle>

            {expanded ? (
                <Content>
                    <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
                    <StyledReadMoreButton endIcon={<ExpandLessIcon />} onClick={() => setExpanded(false)}>
                        {i18n.t("Click here to read less")}
                    </StyledReadMoreButton>
                </Content>
            ) : (
                <StyledReadMoreButton endIcon={<ExpandMoreIcon />} onClick={() => setExpanded(true)} marginLeft="8px">
                    {i18n.t("Click here to read more")}
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
    padding: 16px;
    color: ${colors.black};
`;

const CountryExperienceContent = styled.div`
    padding: 20px;
    margin: 20px;
    background-color: ${colors.blue5};
    border: 1px solid ${colors.darkBlue};
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const StyledTitle = styled(Typography)`
    margin-inline-end: 24px;
    color: ${colors.black};

    &.MuiTypography-h6 {
        font-weight: bold;
    }
`;

const StyledText = styled(Typography)`
    font-family: Lato;
    color: ${colors.black};
`;

const StyledLi = styled.li`
    line-height: 1.43;
    color: ${colors.black};
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
    color: ${colors.black};
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const StyledLink = styled(Button)`
    font-size: 14px;
    font-weight: bold;

    span {
        color: black;
        text-decoration: none;
        text-transform: none;
    }
`;

const StyledIconButton = styled(IconButton)<{ $color: string; padding: string }>`
    position: absolute;
    right: 10px;
    top: 10px;
    padding: ${props => props.padding};
    color: ${props => props.$color};
`;

const CustomInfoIconCountry = styled(InfoIcon)`
    color: ${colors.darkBlue};
    font-size: 25px;
`;

const StyledReadMoreButton = styled(Button)<{ marginLeft?: string }>`
    text-transform: none;
    color: ${colors.black};
    font-weight: bold;
    padding: 0;
    margin: 0;
    margin-left: ${props => props.marginLeft || "0"};

    :hover {
        background-color: transparent;
    }
    .MuiButton-endIcon {
        margin-inline-start: 4px;
        position: relative;
        inset-block-end: 2px;
    }
`;
