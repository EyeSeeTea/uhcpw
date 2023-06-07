import React, { useEffect } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";
import { Resources } from "../../components/home/resources/Resources";
import { Layout } from "../../components/layout/Layout";
import { useMap } from "../../components/home/map/useMap";
import { useResourcesByType } from "../resources/by-type/useResourcesByType";

export const HomePage: React.FC = React.memo(() => {
    const mapState = useMap();
    const { items, onGetResources } = useResourcesByType({ count: 6 });

    useEffect(() => {
        onGetResources();
    }, [onGetResources]);

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
                <Resources resources={items} />
            </section>
        </Layout>
    );
});

const MapSection = styled.section`
    height: 80vh;
`;
