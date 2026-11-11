import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import { ReactComponent as Bubble } from "../../assets/bubble-pattern.svg";
import { useCountryExpert } from "../../pages/country/useCountryExpert";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { Id } from "../../../domain/entities/Ref";
import { colors } from "../../pages/app/themes/dhis2.theme";

export type CountryExpertProps = {
    countryIds: Id[];
    isRegionalPage?: boolean;
    isSmallScreen?: boolean;
};

export const CountryExpert: React.FC<CountryExpertProps> = ({
    countryIds,
    isRegionalPage = false,
    isSmallScreen = false,
}) => {
    const { experts } = useCountryExpert(countryIds);

    return (
        <Container aria-label="experts" isRegionalPage={isRegionalPage}>
            {isRegionalPage ? null : (
                <TitleRow>
                    <StyledBubble aria-hidden="true" focusable="false" />
                    <Typography variant="h5">{i18n.t("Experts")}</Typography>
                </TitleRow>
            )}

            <GridContainer container spacing={5}>
                {experts.map((expert, i) => (
                    <Grid
                        item
                        key={`${expert.firstName}_${expert.lastName}_${i}`}
                        xs={12}
                        sm={6}
                        md={isRegionalPage && !isSmallScreen ? 3 : 6}
                        role="listitem"
                    >
                        <Row isRegionalPage={isRegionalPage}>
                            <Image src={expert.image} alt={`${expert.firstName} ${expert.lastName}`} />

                            <ExpertDetailsContainer isRegionalPage={isRegionalPage}>
                                <LatoTypography variant="body1" style={{ fontWeight: "bold" }}>
                                    {i18n.t(`${expert.firstName} ${expert.lastName}`)}
                                </LatoTypography>

                                <StyledTypography variant="body1" isRegionalPage={isRegionalPage}>
                                    {i18n.t(expert.position)}
                                </StyledTypography>

                                {expert.institution && (
                                    <StyledTypography variant="body1" isRegionalPage={isRegionalPage}>
                                        {i18n.t(expert.institution)}
                                    </StyledTypography>
                                )}

                                <StyledTypography variant="body1" isRegionalPage={isRegionalPage}>
                                    {i18n.t(expert.countryName)}
                                </StyledTypography>
                            </ExpertDetailsContainer>
                        </Row>
                    </Grid>
                ))}
            </GridContainer>
        </Container>
    );
};

const Container = styled.div<{ isRegionalPage?: boolean }>`
    position: relative;
    padding: 40px 60px;
    background: white;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 30px 20px;
    }
`;

const StyledBubble = styled(Bubble)`
    position: absolute;
    top: 0;
    right: 0;
    height: auto;
    width: 100%;
    pointer-events: none;
    opacity: 0.9;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 260px;
    }
`;

const GridContainer = styled(Grid)`
    margin: 30px 0px;
    width: 100%;
    color: ${colors.black};

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin: 0;
    }
`;

const StyledTypography = styled(Typography)<{ isRegionalPage?: boolean }>`
    text-align: ${props => (props.isRegionalPage ? "center" : "left")};

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        text-align: center;
    }
`;

const LatoTypography = styled(StyledTypography)`
    font-family: Lato;
`;

const Row = styled.div<{ isRegionalPage?: boolean }>`
    display: flex;
    align-items: center;
    gap: 40px;
    margin: 30px 10px 30px 0px;
    flex-direction: ${props => (props.isRegionalPage ? "column" : "row")};
    position: relative;
    z-index: 1;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        flex-direction: column;
    }
`;

const ExpertDetailsContainer = styled.div<{ isRegionalPage?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: ${props => (props.isRegionalPage ? "center" : "left")};

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        align-items: center;
    }
`;

const Image = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 6px;
    object-fit: cover;
    object-position: 50% 0%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 150px;
        height: 150px;
    }
`;

const TitleRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline-start: 0px;
        margin-block-end: 0;
    }
`;
