import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled, { css } from "styled-components";
import Umbrella from "../../../assets/country-page/umbrella-3.svg";
import Rain from "../../../assets/country-page/rain.png";
import { Country } from "../../../../domain/entities/Country";

export const SlideInfoOne: React.FC<{ country: Country }> = ({ country }) => {
    const {
        sliderInfo: { gapsSection },
    } = country;

    return (
        <Container>
            <Typography variant="h3" style={{ fontWeight: 500 }}>
                {i18n.t(gapsSection.sectionName)}
            </Typography>
            <Grid container>
                <Grid item xs={12} md={8}>
                    <Column>
                        {gapsSection.content.map(({ title, text }) => (
                            <>
                                <Title>{i18n.t(title)}</Title>
                                <Paragraph>{i18n.t(text)}</Paragraph>
                            </>
                        ))}
                    </Column>
                </Grid>
                <UmbrellaContainer item xs={12} md={4}>
                    <Image src={Umbrella} />
                </UmbrellaContainer>
            </Grid>
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
    padding: 0px 10px 20px 30px;
    @media (min-width: 960px) {
        > h3 {
            ${visuallyHidden};
        }
    }
`;

const UmbrellaContainer = styled(Grid)`
    display: none;
    @media (min-width: 1024px) {
        display: flex;
        height: 100vh;
        background: url(${Rain}) top;
        align-items: start;
        padding-block-start: 40px;
        justify-content: center;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 15px;
    max-width: 658px;
    width: 100%;
    padding-block: 46px;
`;

const Title = styled(Typography)`
    font-weight: bold;
    color: #b20101;
`;

const Paragraph = styled(Typography)`
    margin-block-end: 10px;
`;

const Image = styled.img`
    width: 100%;
    max-width: 225px;
    height: auto;
`;
