import React from "react";
import styled from "styled-components";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";
import { Resources } from "../../components/home/resources/Resources";
import { Layout } from "../../components/layout/Layout";

export const HomePage: React.FC = React.memo(() => {
    return (
        <Layout>
            <MapSection>
                <Map />
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
                <Resources />
            </section>
        </Layout>
    );
});

const MapSection = styled.section`
    height: 80vh;
`;
