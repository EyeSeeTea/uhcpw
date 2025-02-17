import React, { useEffect } from "react";
import { useAppContext } from "../../../contexts/app-context";
import styled from "styled-components";
import { Button, Typography } from "@material-ui/core";
import { getCookie, setCookie } from "../../../utils/cookies";

const COOKIES_POLICY_CONTENT =
    'We use our own and third-party cookies for functional purposes aimed at enabling proper navigation on our website, analyzing how you interact with us, measuring your use of the services we provide, and improving them. To consent to their use and confirm that you have read the information provided, click the "OK" button. To withdraw your consent, click the "Revoke" button, which can be found at the bottom of the homepage. You can find more information by consulting our Cookie Policy.';
const COOKIE_ACCEPTED_NAME = "cookie_notice_accepted";
const COOKIES_EXPIRATION = 30; //days

export const CookiesDisclaimer: React.FC = () => {
    const { generalContent } = useAppContext();
    const [showBanner, setShowBanner] = React.useState<boolean>(true);

    const openPrivacyPolicy = () => {
        window.open(generalContent?.cookies.policyUrl, "_blank");
    };

    const handleAccept = () => {
        setCookie(COOKIE_ACCEPTED_NAME, true, COOKIES_EXPIRATION);
        setShowBanner(false);
    };

    const handleReject = () => {
        setCookie(COOKIE_ACCEPTED_NAME, false, COOKIES_EXPIRATION);
        setShowBanner(false);
    };

    useEffect(() => {
        const cookieAccepted = getCookie(COOKIE_ACCEPTED_NAME);
        setShowBanner(cookieAccepted === null);
    }, []);

    return showBanner ? (
        <CookiesContainer>
            <Typography variant="body1">{COOKIES_POLICY_CONTENT}</Typography>
            <CookieActions>
                <StyledButton onClick={openPrivacyPolicy}>
                    <Typography variant="body1">Cookie Policy</Typography>
                </StyledButton>
                <StyledButton onClick={handleAccept}>
                    <Typography variant="body1">OK</Typography>
                </StyledButton>
                <StyledButton onClick={handleReject}>
                    <Typography variant="body1">No</Typography>
                </StyledButton>
            </CookieActions>
        </CookiesContainer>
    ) : null;
};

const CookiesContainer = styled.div`
    background: #ff8d4e;
    position: fixed;
    bottom: 0;
    padding: 15px 30px;
    text-align: center;
    z-index: 2000;
    color: white;
`;

const CookieActions = styled.div`
    display: flex;
    justify-content: center;
    margin: 1.7em 0 1.7em;
    gap: 10px;
`;

const StyledButton = styled(Button)`
    background: #ffbc88;
    padding: 10px 20px;
    text-transform: none;
    color: white;
`;
