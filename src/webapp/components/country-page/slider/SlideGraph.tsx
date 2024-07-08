import { Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled, { css } from "styled-components";
import { VisualizationPlugin } from "../../visualization/VisualizationPlugin";

type VisualizationProps = {
    visualizationId: string;
    years: string[];
    countries: string[];
};

type SlideGraphType = {
    title: string;
    countryId: string;
    graphOne: VisualizationProps;
    graphTwo?: VisualizationProps;
};

export const SlideGraph: React.FC<SlideGraphType> = ({ title, countryId, graphOne, graphTwo }) => {
    return (
        <Container>
            <Typography variant="h3" style={{ marginBottom: "50px", fontWeight: 500, fontSize: "2rem" }}>
                {i18n.t(title)}
            </Typography>
            <VisualizationContainer>
                <VisualizationPlugin
                    visualizationId={(graphOne as VisualizationProps).visualizationId}
                    years={(graphOne as VisualizationProps).years}
                    countries={(graphOne as VisualizationProps).countries}
                    withoutBackground
                    useHeaderForCountryPage
                    currentCountry={countryId}
                />
            </VisualizationContainer>
            {graphTwo && (
                <VisualizationContainer>
                    <VisualizationPlugin
                        visualizationId={(graphTwo as VisualizationProps).visualizationId}
                        years={(graphTwo as VisualizationProps).years}
                        countries={(graphTwo as VisualizationProps).countries}
                        withoutBackground
                        useHeaderForCountryPage
                        currentCountry={countryId}
                    />
                </VisualizationContainer>
            )}
        </Container>
    );
};

const visuallyHidden = css`
    position: absolute;
    width: 0.0625rem;
    height: 0.0625rem;
    overflow: hidden;
    white-space: nowrap;
    clip: rect(0 0 0 0);
    clip-path: inset(100%);
`;

const Container = styled.div`
    max-width: 100%;
    padding: 20px 50px 30px 50px;
    @media (min-width: 960px) {
        > h3 {
            ${visuallyHidden};
        }
    }
`;

const VisualizationContainer = styled.div`
    > div {
        margin: 0;
        padding: 0;
        @media (min-width: 960px) {
            padding-inline-end: 3.75rem;
        }
    }
    width: 100%;
`;
