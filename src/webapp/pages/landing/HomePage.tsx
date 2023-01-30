import React from "react";
import styled from "styled-components";
import { Map } from "../../components/map/Map";

export const HomePage: React.FC = React.memo(() => {
    return (
        <>
            <MapSection>
                <Map />
            </MapSection>
        </>
    );
});

const MapSection = styled.section`
    height: 80vh;
`;
