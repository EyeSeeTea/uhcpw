import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";
import bulgariaReport from "../../assets/country-page/bulgaria-report.jpg";
import bulgariaInfographic from "../../assets/country-page/bulgaria-infographic.jpg";
import bulgariaSummary from "../../assets/country-page/bulgaria-summary.jpg";
import { colors } from "../../pages/app/themes/dhis2.theme";

const countryResources = [
    {
        title: "Can people afford to pay for health care? New evidence on financial protection in Bulgaria",
        image: bulgariaReport,
        year: "2022",
        languages: [
            {
                name: "English",
                link: "https://apps.who.int/iris/handle/10665/349200",
            },
        ],
        theme: "Financial protection",
    },
    {
        title: "Can people afford to pay for health care? New evidence on financial protection in Bulgaria",
        image: bulgariaSummary,
        year: "2022",
        languages: [
            {
                name: "English",
                link: "https://cdn.who.int/media/docs/librariesprovider2/country-sites/bulgaria-a4-brochure-eng---who.pdf?sfvrsn=e7d052f4_1&download=true",
            },
            {
                name: "болгарски",
                link: "https://cdn.who.int/media/docs/librariesprovider2/country-sites/bulgaria-a4-brochure-bul4---who-(1).pdf?sfvrsn=29c15926_1&download=true",
            },
        ],
        theme: "Financial protection",
    },
    {
        title: "Financial protection in Bulgaria",
        image: bulgariaInfographic,
        year: "2022",
        languages: [
            {
                name: "English",
                link: "https://who.canto.global/s/Q9PJ8?column=document&id=1ujduedca53rb5keb9hu9d316i&viewIndex=0",
            },
        ],
        theme: "Financial protection",
    },
];

export const CountryResources: React.FC = () => {
    return (
        <Container>
            <Row>
                <Typography variant="h3">{i18n.t("Country Resources")}</Typography>
                <ChevronRightIcon link="/resources" />
            </Row>
            <Grid container spacing={5}>
                {countryResources.map((resource, i) => {
                    return (
                        <Grid key={i} item xs={12} md={4} lg={3}>
                            <Column>
                                <Image src={resource.image} alt={resource.title} />
                                <Tag>
                                    <Typography variant="body2">{resource.theme}</Typography>
                                </Tag>
                                <ContentColumn>
                                    <TextRow>
                                        <Typography style={{ marginRight: "4px" }}>{resource.year} | </Typography>
                                        {resource.languages.map((language, i) => (
                                            <>
                                                <a
                                                    key={language.name}
                                                    href={language.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Typography
                                                        style={{
                                                            marginRight: "4px",
                                                            marginLeft: "4px",
                                                            color: colors.accentPrimary,
                                                        }}
                                                    >
                                                        {language.name}
                                                    </Typography>
                                                </a>
                                                {i + 1 < resource.languages.length && <Typography>,</Typography>}
                                            </>
                                        ))}
                                    </TextRow>
                                    <Typography style={{ marginTop: "10px" }}>{resource.title}</Typography>
                                </ContentColumn>
                            </Column>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

const Container = styled.div`
    padding: 40px 0px 40px 60px;
    max-width: 80%;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 25px;
`;

const TextRow = styled(Row)`
    margin-bottom: 10px;
`;

const Column = styled.div`
    padding: 16px;
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: start;
`;

const ContentColumn = styled(Column)`
    padding: 10px;
`;

const Image = styled.img``;

const Tag = styled.div`
    font-size: 10px;
    border-radius: 20px;
    background: #efefef;
    background-color: ${colors.accentPrimary};
    color: white;
    padding: 4px 16px;
    margin-top: 8px;
    display: inline-block;
`;
