import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Analysis } from "../../components/home/analysis/Analysis";
import { Explorers } from "../../components/home/explorers/Explorers";
import { Map } from "../../components/home/map/Map";
import { Methods } from "../../components/home/methods/Methods";
import { Resources } from "../../components/home/resources/Resources";
import { Layout } from "../../components/layout/Layout";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Button } from "@material-ui/core";

export const HomePage: React.FC = React.memo(() => {
    return (
        <Layout
            headerAction={
                <SwitchColourButton variant="contained" color="default" startIcon={<VisibilityIcon />}>
                    {i18n.t("Switch to colour-blind friendly")}
                </SwitchColourButton>
            }
        >
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

const SwitchColourButton = styled(Button)`
    background: white;
    text-transform: none;
    border-radius: 20px;
    margin-left: 48px;
`;

const MapSection = styled.section`
    height: 80vh;
`;
