import { Box, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { ResourceLink } from "../../../../domain/entities/resources/Resource";
import { Tag } from "../tag/Tag";
import { useHistory } from "react-router-dom";

export interface CountryAnalysisProps {
    title: string;
    themeCode: string;
    themeName: string;
    links: ResourceLink[];
    image: string;
    date: Date;
    minimalVersion?: boolean;
    type: "country-analysis" | "comparative-analysis";
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

export const AnalysisItem: React.FC<CountryAnalysisProps> = React.memo(
    ({ title, themeCode, themeName, links, image, date, minimalVersion, type }) => {
        const history = useHistory();

        const handleTagClick = () => {
            history.push(`/resources/${type}?theme=${themeName}`);
        };

        return (
            <Column>
                <a href={links[0]?.url} target="_blank" rel="noopener noreferrer">
                    <Cover width={"100%"} src={image} alt={title} />
                </a>

                <Box height={20} />
                {themeName ? (
                    <Tag
                        theme={themeName + "x"}
                        color={themeColor[themeCode?.toLowerCase()] || themeColor.default}
                        onClick={handleTagClick}
                    />
                ) : (
                    <EmptyTag />
                )}
                {!minimalVersion && (
                    <>
                        <Row>
                            <StyledTypography variant="body1">{date.getFullYear()}</StyledTypography>

                            {links.map((link, index) => {
                                return (
                                    <React.Fragment key={link.url}>
                                        <a
                                            href={link.url}
                                            style={{ fontSize: "16px" }}
                                            target="_blank"
                                            rel="oopener noreferrer"
                                        >
                                            {link.language}
                                        </a>
                                        {index < links.length - 1 && <Box margin={"4px"} />}
                                    </React.Fragment>
                                );
                            })}
                        </Row>
                        <Box height={6} />
                        <Typography variant="body1">{title}</Typography>
                    </>
                )}
            </Column>
        );
    }
);

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

const StyledTypography = styled(Typography)`
    margin-right: 8px;
`;

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const Cover = styled.img`
    border: 1px solid #c3bfbf;
    min-height: 14rem;
    max-height: 14rem;
    @media (max-width: 960px) {
        min-height: 19rem;
        max-height: 19rem;
    }
`;

const EmptyTag = styled.div`
    height: 28px;
`;
