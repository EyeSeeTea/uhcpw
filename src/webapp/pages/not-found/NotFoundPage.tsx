import React from "react";
import { Typography, Button, Container } from "@material-ui/core";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import i18n from "../../../locales";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import bubblePatternWhite from "../../assets/bubble-pattern-white.png";

export const NotFoundPage: React.FC = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { sendPageView } = useAnalytics();

    React.useEffect(() => {
        sendPageView({ title: "Page not found" });
    }, [pathname, sendPageView]);

    const handleGoHome = () => {
        history.push("/");
    };

    return (
        <Layout>
            <TitleContainer aria-label="not-found-page-header">
                <BubbleImg
                    src={bubblePatternWhite}
                    alt="Bubble pattern"
                    aria-hidden="true"
                    decoding="async"
                    loading="eager"
                />
                <Typography variant="h3">{i18n.t("Page Not Found")}</Typography>
            </TitleContainer>

            <ContentContainer>
                <StyledContainer maxWidth="md">
                    <Typography variant="h4" gutterBottom>
                        {i18n.t("404")}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {i18n.t("The page you are looking for does not exist or has been moved.")}
                    </Typography>
                    <StyledButton variant="contained" color="primary" onClick={handleGoHome}>
                        {i18n.t("Go to Homepage")}
                    </StyledButton>
                </StyledContainer>
            </ContentContainer>
        </Layout>
    );
};

const TitleContainer = styled.div`
    position: relative;
    background-color: ${colors.accentSecondary};
    padding: 60px 0px 60px 150px;
    overflow: hidden;

    @media (max-width: 600px) {
        padding: 30px 20px;
    }

    h3 {
        font-size: 44px;
        font-weight: 400;
        color: white;

        @media (max-width: 600px) {
            font-size: 32px;
        }
    }
`;

const BubbleImg = styled.img`
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
    width: auto;
    object-fit: cover;
    opacity: 0.3;

    @media (max-width: 600px) {
        display: none;
    }
`;

const ContentContainer = styled.div`
    padding: 80px 0;
    background-color: white;

    @media (max-width: 600px) {
        padding: 40px 0;
    }
`;

const StyledContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;

    h4 {
        font-size: 72px;
        font-weight: 700;
        color: ${colors.accentSecondary};

        @media (max-width: 600px) {
            font-size: 48px;
        }
    }

    p {
        font-size: 18px;
        color: ${colors.greyBlack};
        max-width: 600px;

        @media (max-width: 600px) {
            font-size: 16px;
        }
    }
`;

const StyledButton = styled(Button)`
    margin-top: 20px;
    padding: 12px 32px;
    font-size: 16px;
    text-transform: none;
    background-color: ${colors.accentSecondary};

    &:hover {
        background-color: ${colors.accentPrimary};
    }
`;
