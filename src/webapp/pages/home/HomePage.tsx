import React from "react";
import styled from "styled-components";
import { AppBar } from "../../components/app-bar/AppBar";
import { Map } from "../../components/map/Map";

export const HomePage: React.FC = React.memo(() => {
    return (
        <>
            <AppBar />
            <MapSection>
                <Map />
            </MapSection>
        </>
    );
});

const MapSection = styled.section`
    height: 80vh;
`;
