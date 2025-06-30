import React from "react";
import styled from "styled-components";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";
import { Resources } from "../../components/home/resources/Resources";
import { useMap } from "../../components/home/map/useMap";
import { useHomeResources } from "./useHomeResources";
import { NewsletterButton } from "../../components/home/buttons/NewsletterButton";
import { useHomePageContent } from "./useHomePageContent";

export const DesktopHomePage: React.FC = React.memo(() => {
    const mapState = useMap();
    const { resources } = useHomeResources();
    const homePageContent = useHomePageContent();

    return (
        <React.Fragment>
            <NewsletterButton content={homePageContent.newsletter} />
            <MapSection>
                <Map mapState={mapState} welcomePanelContent={homePageContent.mainMapPanel} />
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

const MapSection = styled.section`
    height: 80vh;
    min-height: 620px;
`;
