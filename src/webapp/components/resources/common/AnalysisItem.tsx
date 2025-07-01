import { Box, Typography } from "@material-ui/core";

import React, { useMemo } from "react";
import styled from "styled-components";
import { ResourceLink } from "../../../../domain/entities/resources/Resource";
import { Tag } from "../tag/Tag";
import { useHistory } from "react-router-dom";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";

export interface CountryAnalysisProps {
    title: string;
    themeCode: string;
    themeName: string;
    links: ResourceLink[];
    image: string;
    date: Date;
    minimalVersion?: boolean;
    type: "country-analysis" | "comparative-analysis";
    redirectWithEvent: (language: string) => (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const themeColor: Record<string, string> = {
    default: "#0360a7",
    "financial protection": "#0360a7",
    "health financing policy papers": "rgb(0, 138, 215, 0.5)",
    "spending on health": "#002060",
    resilience: "#4fad56",
    "voluntary health insurance": "#ff8d4e",
    "health and economy": "#c42929",
};

export const AnalysisItem: React.FC<CountryAnalysisProps> = React.memo(props => {
    const { title, themeCode, themeName, links, image, date, minimalVersion, type, redirectWithEvent } = props;

    const history = useHistory();

    const handleTagClick = () => {
        history.push(`/resources/${type}?theme=${themeName}`);
    };

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
                {themeName ? (
                    <Tag
                        theme={themeName}
                        color={themeColor[themeCode?.toLowerCase()] || themeColor.default}
                        onClick={handleTagClick}
                    />
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

const TagContainer = styled.div`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline: 16px;
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
