import React from "react";
import { Link } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../../locales";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

export const AbbreviationsAndGlossary: React.FC = () => {
    const { redirectWithPageView } = useAnalytics();

    const abbreviationsPageView = redirectWithPageView({ title: "Abbreviations" });
    const glossaryPageView = redirectWithPageView({ title: "Glossary" });

    return (
        <Container>
            <StyledLink target="_blank" href="https://cmyn.short.gy/abbreviations" onClick={abbreviationsPageView}>
                {i18n.t("Abbreviations")}
            </StyledLink>

            <StyledLink target="_blank" href="https://cmyn.short.gy/glossary" onClick={glossaryPageView}>
                {i18n.t("Glossary")}
            </StyledLink>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledLink = styled(Link)`
    color: white;
    text-decoration: none;
`;
