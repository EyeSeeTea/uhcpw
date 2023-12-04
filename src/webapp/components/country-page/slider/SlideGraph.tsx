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
    graphOne: VisualizationProps;
    graphTwo?: VisualizationProps;
};

export const SlideGraph: React.FC<SlideGraphType> = ({ title, graphOne, graphTwo }) => {
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
    @media (min-width: 960px) {
        > h3 {
            ${visuallyHidden};
        }
    }
`;

const VisualizationContainer = styled.div`
    > div {
        margin: 0;
    }
    max-width: 100%;
`;
