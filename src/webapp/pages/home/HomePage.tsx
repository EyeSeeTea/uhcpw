import React from "react";
import styled from "styled-components";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";
import { Resources } from "../../components/home/resources/Resources";
import { Layout } from "../../components/layout/Layout";
import { useMap } from "../../components/home/map/useMap";
import { useHomeResources } from "./useHomeResources";

export const HomePage: React.FC = React.memo(() => {
    const mapState = useMap();
    const { resources } = useHomeResources();

    return (
        <Layout>
            <MapSection>
                <Map mapState={mapState} />
            </MapSection>
            <section>
                <Explorers />
            </section>
            <section>
                <Analysis />
            </section>
            <section>
                <Methods />
            </section>
            <section>
                <Resources resources={resources} />
            </section>
        </Layout>
    );
});

const MapSection = styled.section`
    height: 80vh;
`;
