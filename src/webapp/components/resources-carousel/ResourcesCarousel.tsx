import React, { useCallback, useState } from "react";
import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";

import { colors } from "../../pages/app/themes/dhis2.theme";
import { ResourceState } from "../../pages/resources/by-type/ResourcesByTypeState";
import { ResourceItem } from "./ResourceItem";
import { useHistory } from "react-router-dom";

type ResourcesCarouselProps = {
    resources: ResourceState[];
    hideTag?: boolean;
};

export const ResourcesCarousel: React.FC<ResourcesCarouselProps> = React.memo(props => {
    const { resources, hideTag = false } = props;
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
                {resources.map((resource, i) => (
                    <Card key={`carousel_item_${i}`}>
                        <ResourceItem
                            resource={resource}
                            handleOnTagClick={handleOnTagClick}
                            disableMainPadding
                            hideTag={hideTag}
                        />
                    </Card>
                ))}
            </SwipeableViews>

            <Dots>
                {resources.map((_, i) => (
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

const Card = styled.div`
    background: white;
    margin: 0 auto;
    border-radius: 10px;
    width: 90%;
    max-width: 350px;
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
