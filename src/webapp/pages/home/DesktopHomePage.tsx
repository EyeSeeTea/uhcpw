import React, { useState } from "react";
import styled from "styled-components";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";
import { Resources } from "../../components/home/resources/Resources";
import { useHomePageMap } from "./useHomePageMap";
import { useHomeResources } from "./useHomeResources";
import { NewsletterButton } from "../../components/home/buttons/NewsletterButton";
import { useHomePageContent } from "./useHomePageContent";

export const DesktopHomePage: React.FC = React.memo(() => {
    const mapState = useHomePageMap();
    const { resources } = useHomeResources();
    const homePageContent = useHomePageContent();
    const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);

    return (
        <React.Fragment>
            <NewsletterButton content={homePageContent.newsletter} />
            <MapSection $panelHeight={panelHeight}>
                <Map
                    mapState={mapState}
                    homePagePanelContent={homePageContent.mainMapPanel}
                    onPanelHeightComputed={setPanelHeight}
                />
            </MapSection>
            <section>
                <Explorers content={homePageContent.explorers} />
            </section>
            <section>
                <Analysis content={homePageContent.analysis} />
            </section>
            <section>
                <Methods content={homePageContent.methods} />
            </section>
            <section>
                <Resources resources={resources} />
            </section>
        </React.Fragment>
    );
});

const MapSection = styled.section<{ $panelHeight?: number }>`
    height: ${props => (props.$panelHeight ? `max(90vh, ${props.$panelHeight}px)` : "90vh")};
    min-height: 620px;
`;
