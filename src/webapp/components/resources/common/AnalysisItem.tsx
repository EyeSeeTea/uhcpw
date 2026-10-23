import { Box, Typography } from "@material-ui/core";

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { ResourceLink } from "../../../../domain/entities/resources/Resource";
import { ResourceTheme } from "../../../../domain/entities/resources/ResourceTheme";
import { Tag } from "../tag/Tag";
import { getThemeColor } from "../tag/themeColor";
import { useHistory } from "react-router-dom";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";
import { useAppContext } from "../../../contexts/app-context";
import { getParamFromThemes } from "../../../utils/formatResourcesThemeParamName";

export interface CountryAnalysisProps {
    title: string;
    themes: ReadonlyArray<ResourceTheme>;
    links: ResourceLink[];
    image: string;
    date: Date;
    minimalVersion?: boolean;
    type: "country-analysis" | "comparative-analysis";
    redirectWithEvent: (language: string) => (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const AnalysisItem: React.FC<CountryAnalysisProps> = React.memo(props => {
    const { title, themes, links, image, date, minimalVersion, type, redirectWithEvent } = props;

    const history = useHistory();
    const { themes: allThemes } = useAppContext();

    const handleTagClick = useCallback(
        (themeName: string) => {
            const themeParam = getParamFromThemes(allThemes, themeName);

            history.push(themeParam ? `/resources/${type}/${themeParam}` : `/resources/${type}`);
        },
        [history, allThemes, type]
    );

    const redirectWithDefaultLangForEvent = useMemo(
        () => links[0] && redirectWithEvent(links[0].language),
        [links, redirectWithEvent]
    );

    return (
        <Column>
            <StyledAnchor
                href={links[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={redirectWithDefaultLangForEvent}
            >
                <Cover width={"100%"} src={image} alt={title} />
            </StyledAnchor>

            <Box height={20} />

            <TagContainer>
                {themes.length > 0 ? (
                    themes.map(theme => (
                        <Tag
                            key={theme.id}
                            theme={theme.name}
                            title={theme.name}
                            color={getThemeColor(theme.code)}
                            compact
                            onClick={() => handleTagClick(theme.name)}
                        />
                    ))
                ) : (
                    <EmptyTag />
                )}
            </TagContainer>

            {!minimalVersion && (
                <>
                    <Row>
                        <StyledTypography variant="body1">{date.getFullYear()}</StyledTypography>

                        {links.map((link, index) => {
                            return (
                                <React.Fragment key={link.url}>
                                    <a
                                        href={link.url}
                                        style={body1Style}
                                        target="_blank"
                                        rel="oopener noreferrer"
                                        onClick={redirectWithEvent(link.language)}
                                    >
                                        {link.language}
                                    </a>
                                    {index < links.length - 1 && <Box margin={"4px"} />}
                                </React.Fragment>
                            );
                        })}
                    </Row>
                    <Box height={6} />
                    <StyledText variant="body1">{title}</StyledText>
                </>
            )}
        </Column>
    );
});

const body1Style = { fontSize: "16px" };

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline: 16px;
    }
`;

const StyledAnchor = styled.a`
    min-height: 14rem;
    max-height: 14rem;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        place-self: center;
        min-height: 19rem;
        max-height: 19rem;
    }
`;

// Cards are 180px wide: the two compact theme chips fit in one row, left to right. On small screens the
// country and regional pages show two narrow cards per row, so there the second chip may wrap.
const TagContainer = styled.div`
    white-space: nowrap;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline: 16px;
        white-space: normal;
    }
`;

const StyledTypography = styled(Typography)`
    margin-right: 8px;
`;

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 100%;
    }
`;

const Cover = styled.img`
    border: 1px solid #c3bfbf;
    min-height: 14rem;
    max-height: 14rem;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        min-height: 19rem;
        max-height: 19rem;
        border: none;
        align-items: start;
    }
`;

const EmptyTag = styled.div`
    height: 28px;
`;

const StyledText = styled(Typography)`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-end: 16px;
        margin-inline: 16px;
    }
`;
