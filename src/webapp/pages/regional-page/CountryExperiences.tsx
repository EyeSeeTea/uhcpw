import React, { useCallback, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";
import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";
import { useHistory } from "react-router-dom";

import i18n from "../../../locales";
import { colors } from "../app/themes/dhis2.theme";
import { useAppContext } from "../../contexts/app-context";
import { Id } from "../../../domain/entities/Ref";

export const CountryExperiences: React.FC = () => {
    const { countries } = useAppContext();
    const history = useHistory();

    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Typography variant="body1" gutterBottom>
                    {children}
                </Typography>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
        }),
        []
    );

    const onCountryLinkClick = useCallback(
        (countryId: Id) => {
            history.push(`/country-page?country=${countryId}`);
        },
        [history]
    );

    const countriesWithExperiences = React.useMemo(() => {
        return countries.filter(
            country => country.countryExperience && country.countryExperience.title && country.countryExperience.content
        );
    }, [countries]);

    return (
        <Container>
            <StyledTypography variant="h6" gutterBottom>
                {i18n.t("Country experiences")}
            </StyledTypography>

            <CarrouselContainer>
                <SwipeableViews index={currentItemIndex} onChangeIndex={setCurrentItemIndex} enableMouseEvents>
                    {countriesWithExperiences.map((country, index) => {
                        return (
                            <CountryExperienceContent key={`experience_${country.id}_${index}`}>
                                <StyledTypography variant="h6" gutterBottom>
                                    {country.countryExperience.title}
                                </StyledTypography>

                                <ReactMarkdown components={markdownComponents}>
                                    {country.countryExperience.content}
                                </ReactMarkdown>

                                {country.isInCountryPage && (
                                    <StyledLink
                                        variant="text"
                                        onClick={() => onCountryLinkClick(country.id)}
                                        aria-label={`Go to ${country.name} country page`}
                                    >
                                        {i18n.t("See {{countryName}} country page", { countryName: country.name })}
                                    </StyledLink>
                                )}
                            </CountryExperienceContent>
                        );
                    })}
                </SwipeableViews>

                <Dots>
                    {countriesWithExperiences.map((country, index) => (
                        <Dot
                            key={`carousel_dot_${country.id}_${index}`}
                            active={index === currentItemIndex}
                            onClick={() => setCurrentItemIndex(index)}
                        />
                    ))}
                </Dots>
            </CarrouselContainer>
        </Container>
    );
};

const Container = styled.div``;

const CarrouselContainer = styled.div``;

const CountryExperienceContent = styled.div`
    padding: 20px;
    margin: 20px;
    background-color: ${colors.white};
    border: 1px solid #156082;
`;

const StyledTypography = styled(Typography)`
    &.MuiTypography-h6 {
        font-weight: bold;
    }
`;

const StyledLi = styled.li`
    line-height: 1.43;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
`;

const StyledLink = styled(Button)`
    font-size: 16px;

    span {
        color: black;
        text-decoration: none;
        text-transform: none;
    }
`;

const Dots = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 16px;
    gap: 8px;
`;

const Dot = styled.button<{ active: boolean }>`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    background-color: ${props => (props.active ? `${colors.darkBlue}` : `${colors.carouselDotBackground}`)};
    cursor: pointer;
`;
