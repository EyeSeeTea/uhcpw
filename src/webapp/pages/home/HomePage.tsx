import React from "react";
import styled from "styled-components";
import { AppFooter } from "../../components/app-footer/AppFooter";
import { AppHeader } from "../../components/app-header/AppHeader";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";

export const HomePage: React.FC = React.memo(() => {
    return (
        <>
            <header>
                <AppHeader />
            </header>

            <main>
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
            </main>

            <footer>
                <AppFooter />
            </footer>
        </>
    );
});

const MapSection = styled.section`
    height: 80vh;
`;
