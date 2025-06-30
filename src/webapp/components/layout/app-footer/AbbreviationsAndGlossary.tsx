import React from "react";
import { Link } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import { useReferenceLinks } from "../../../common/hooks/analytics/useReferenceLinks";

export const AbbreviationsAndGlossary: React.FC = () => {
    const { abbreviationsLink, glossaryLink } = useReferenceLinks();

    return (
        <Container>
            <StyledLink {...abbreviationsLink}>{i18n.t("Abbreviations")}</StyledLink>

            <StyledLink {...glossaryLink}>{i18n.t("Glossary")}</StyledLink>
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
