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
        title: "Can people affor to pay for health care? New evidence on financial protection in Bulgaria",
        image: bulgariaReport,
        year: "2022",
        languages: ["English", "болгарски"],
        theme: "Financial protection",
    },
    {
        title: "Summary",
        image: bulgariaSummary,
        year: "2022",
        languages: ["English", "болгарски"],
        theme: "Financial protection",
    },
    {
        title: "Infographic",
        image: bulgariaInfographic,
        year: "2022",
        languages: ["English", "болгарски"],
        theme: "Financial protection",
    },
];

export const CountryResources: React.FC = () => {
    return (
        <Container>
            <Row>
                <Typography variant="h3">{i18n.t("Country Resources")}</Typography>
                <ChevronRightIcon />
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
                                    <Row>
                                        <Typography style={{ marginRight: "4px" }}>{resource.year} | </Typography>
                                        <Typography style={{ marginRight: "4px", color: colors.accentPrimary }}>
                                            {resource.languages[0]}
                                        </Typography>
                                        <Typography style={{ color: colors.accentPrimary }}>
                                            | {resource.languages[1]}
                                        </Typography>
                                    </Row>
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
    padding: 40px 0px 40px 20px;
    max-width: 80%;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
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
