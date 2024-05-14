import { Grid, Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import styled, { css } from "styled-components";
import i18n from "../../../../locales";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import Rain from "../../../assets/country-page/rain.png";
import { CountrySectionInfo } from "../../../../domain/entities/Country";

export const SlideInfo: React.FC<{ sliderInfo: CountrySectionInfo; titleColor: string; icon: string }> = ({
    sliderInfo,
    titleColor,
    icon,
}) => {
    return (
        <Container>
            <Typography variant="h3" style={{ fontWeight: 500 }}>
                {i18n.t(sliderInfo.sectionName)}
            </Typography>
            <Grid container>
                <Grid item xs={12} md={8}>
                    <Column>
                        {sliderInfo.content.map(({ title, text }) => (
                            <>
                                <Title $titleColor={titleColor}>{i18n.t(title)}</Title>
                                <Paragraph>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => (
                                                <Typography variant="body2" style={{ marginBottom: "10px" }}>
                                                    {children}
                                                </Typography>
                                            ),
                                            ul: ({ children }) => <ul style={{ paddingLeft: "1.2em" }}>{children}</ul>,
                                            li: ({ children }) => (
                                                <li>
                                                    <Typography variant="body2">{children}</Typography>
                                                </li>
                                            ),
                                            a: ({ ...props }) => (
                                                <TextLink href={props.href} target="_blank" rel="noreferrer">
                                                    {props.children}
                                                </TextLink>
                                            ),
                                        }}
                                    >
                                        {i18n.t(text)}
                                    </ReactMarkdown>
                                </Paragraph>
                            </>
                        ))}

                        <Typography variant="body2">{sliderInfo.sourceText}</Typography>
                    </Column>
                </Grid>
                <UmbrellaContainer item xs={12} md={4}>
                    <Image src={icon} />
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

const Title = styled(Typography)<{ $titleColor: string }>`
    font-weight: bold;
    color: ${props => props.$titleColor};
`;

const Paragraph = styled(Typography)`
    :not(last-of-type) {
        margin-block-end: 10px;
    }
`;

const Image = styled.img`
    width: 100%;
    max-width: 225px;
    height: auto;
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;
