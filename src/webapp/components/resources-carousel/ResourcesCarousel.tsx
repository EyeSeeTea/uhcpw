import React, { useCallback, useState } from "react";
import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";
import { Tooltip } from "@material-ui/core";

import { colors } from "../../pages/app/themes/dhis2.theme";
import {
    ComparativeAnalysisState,
    CountryAnalysisState,
    MultimediaState,
} from "../../pages/resources/by-type/ResourcesByTypeState";
import { ResourceItem } from "./ResourceItem";
import { useHistory } from "react-router-dom";
import { News } from "../../../domain/entities/resources/Resource";
import { CountryAnalysisCountry } from "../../pages/resources/landing/ResourcesState";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";

export type ResourceItemProp =
    | News
    | MultimediaState
    | CountryAnalysisState
    | ComparativeAnalysisState
    | CountryAnalysisCountry;

type ResourcesCarouselProps = {
    resourceItems: ResourceItemProp[];
    hideTag?: boolean;
};

export const ResourcesCarousel: React.FC<ResourcesCarouselProps> = React.memo(props => {
    const { resourceItems, hideTag = false } = props;
    const history = useHistory();

    const handleOnTagClick = useCallback(
        (url: string) => {
            history.push(url);
        },
        [history]
    );

    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    return (
        <CarouselContainer>
            <SwipeableViews index={currentItemIndex} onChangeIndex={setCurrentItemIndex} enableMouseEvents>
                {resourceItems.map((resource, i) => {
                    if (resource.kind === "flag") {
                        return (
                            <FlagContainer key={`carousel_item_${i}`}>
                                <Tooltip title={resource.countryName} placement="top" arrow>
                                    <Flag
                                        role="listitem"
                                        src={resource.flag}
                                        onClick={() =>
                                            history.push(
                                                `/resources/country-analysis/${formatCountryOrRegionParamName(
                                                    resource.countryName
                                                )}`
                                            )
                                        }
                                    />
                                </Tooltip>
                            </FlagContainer>
                        );
                    } else {
                        return (
                            <Card
                                key={`carousel_item_${i}`}
                                $fullWidth={resource.kind === "news" || resource.kind === "multimedia"}
                            >
                                <ResourceItem
                                    resource={resource}
                                    handleOnTagClick={handleOnTagClick}
                                    disableMainPadding
                                    hideTag={hideTag}
                                />
                            </Card>
                        );
                    }
                })}
            </SwipeableViews>

            <Dots>
                {resourceItems.map((_, i) => (
                    <Dot
                        key={`carousel_dot_${i}`}
                        active={i === currentItemIndex}
                        onClick={() => setCurrentItemIndex(i)}
                    />
                ))}
            </Dots>
        </CarouselContainer>
    );
});

const CarouselContainer = styled.section`
    padding: 24px;
    background: ${colors.carouselBackground};
`;

const Card = styled.div<{ $fullWidth?: boolean }>`
    background: white;
    margin: 0 auto;
    border-radius: 10px;
    width: 100%;
    max-width: ${props => (props.$fullWidth ? "500px" : "300px")};
`;

const Dots = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 16px;
    gap: 8px;
`;

const Dot = styled.button<{ active: boolean }>`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    background-color: ${props => (props.active ? `${colors.darkBlue}` : `${colors.carouselDotBackground}`)};
    cursor: pointer;
`;
const FlagContainer = styled.div`
    text-align: center;
`;

const Flag = styled.img`
    cursor: pointer;
    width: 90px;
    height: auto;
    border: 3px solid #ffffff;
`;
