import React from "react";
import styled from "styled-components";
import { AppBar } from "../../components/app-bar/AppBar";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";

export const HomePage: React.FC = React.memo(() => {
    return (
        <>
            <AppBar />
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
        </>
    );
});

const MapSection = styled.section`
    height: 80vh;
`;
