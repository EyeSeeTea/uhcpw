import React from "react";
import styled from "styled-components";
import { Table, TableBody, TableCell, TableRow, IconButton, Typography, CircularProgress } from "@material-ui/core";
import { CheckCircleOutline, CheckCircle } from "@material-ui/icons";
import ReactMarkdown, { Components } from "react-markdown";

import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import i18n from "../../../locales";
import { Maybe } from "../../../types/utils";
import { ChecklistPolicyMakersData } from "../../../domain/entities/region/ChecklistPolicyMakers";
import { Id } from "../../../domain/entities/Ref";
import { colors } from "../app/themes/dhis2.theme";
import { CountryExperienceData } from "./useRegionalPolicyChecklist";
import { CountryExperienceBox } from "./CountryExperienceBox";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

type PolicyChecklistSectionProps = {
    textSectionLeft: string;
    textSectionRight: string;
    checklist: Maybe<ChecklistPolicyMakersData[]>;
    filteredCountryExperiences: Maybe<CountryExperienceData[]>;
    selectedChecklistItem: Id | undefined;
    onSelectChecklistItem: (id: Id) => void;
    isLoading: boolean;
    isSmallScreen: boolean;
};

export const PolicyChecklistSection: React.FC<PolicyChecklistSectionProps> = React.memo(props => {
    const {
        textSectionLeft,
        textSectionRight,
        checklist,
        filteredCountryExperiences,
        selectedChecklistItem,
        onSelectChecklistItem,
        isLoading,
        isSmallScreen,
    } = props;
    const { redirectWithExternalLink } = useAnalytics();

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Text variant="body1" gutterBottom>
                    {children}
                </Text>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
            a: ({ ...props }) => (
                <TextLink href={props.href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
                    {props.children}
                </TextLink>
            ),
        }),
        [redirectWithExternalLink]
    );

    return (
        <Container>
            {isLoading || !checklist ? (
                <CircularProgress />
            ) : (
                <>
                    <ContentWrapper>
                        <div>
                            <ReactMarkdown components={markdownComponents}>{textSectionLeft}</ReactMarkdown>
                        </div>

                        <ReactMarkdown components={markdownComponents}>{textSectionRight}</ReactMarkdown>
                    </ContentWrapper>

                    <Title variant="body1">{i18n.t("Click an item to see examples of country experience")}</Title>

                    <ContentWrapper>
                        <TableContainer>
                            <StyledTable>
                                <TableBody>
                                    {checklist.map(item => (
                                        <TableRow key={item.id}>
                                            <StyledTableCell>
                                                <ReactMarkdown components={markdownComponents}>
                                                    {item.text}
                                                </ReactMarkdown>
                                            </StyledTableCell>

                                            <StyledTableCell align="right">
                                                <IconButton onClick={() => onSelectChecklistItem(item.id)}>
                                                    {selectedChecklistItem === item.id ? (
                                                        <CheckCircle color="primary" />
                                                    ) : (
                                                        <CheckCircleOutline />
                                                    )}
                                                </IconButton>
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                        </TableContainer>

                        <CountryExperiencesContainer>
                            {filteredCountryExperiences && filteredCountryExperiences.length > 0
                                ? filteredCountryExperiences.map(countryExperience => (
                                      <CountryExperienceBox
                                          key={countryExperience.countryId}
                                          countryId={countryExperience.countryId}
                                          countryName={countryExperience.countryName}
                                          title={countryExperience.title}
                                          content={countryExperience.content}
                                          reference={countryExperience.reference}
                                          showDialogInFullScreen={isSmallScreen}
                                          disableGoToCountryPage={countryExperience.disableGoToCountryPage}
                                      />
                                  ))
                                : null}
                        </CountryExperiencesContainer>
                    </ContentWrapper>
                </>
            )}
        </Container>
    );
});

const Container = styled.div`
    padding: 40px 20px 40px 60px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-end: 0;
    }
`;

const Title = styled(Typography)`
    font-family: Lato;
    color: ${colors.blue};
    margin-block-start: 25px;
    margin-block-end: 20px;
    font-size: 18px;

    &&& {
        font-weight: bold;
    }
`;

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 45%) minmax(0, 55%);
    gap: 16px;
    width: 100%;
    align-items: stretch;
    > * {
        min-height: 0;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        grid-template-columns: 1fr;
    }
`;

const TableContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-direction: column;
    min-height: 0;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 100%;
    }
`;

const CountryExperiencesContainer = styled.div`
    background-color: ${colors.blue10};
    width: 100%;
    height: 100%;
    align-self: center;
    margin-inline-end: 20px;
    min-height: 0;
    overflow-y: auto;
    max-height: 100%;
    contain: size;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        overflow: visible;
        max-height: none;
        height: auto;
        contain: initial;
        margin-inline-end: 0;
    }
`;

const StyledTable = styled(Table)`
    border-spacing: 0.8px;
    border-collapse: initial;
    tbody > tr:first-child > td {
        vertical-align: middle;
    }
    tbody > tr > td {
        vertical-align: top;
    }
`;

const StyledTableCell = styled(TableCell)`
    color: ${colors.blue};
    font-weight: 500;
    background-color: ${colors.blue10};
    color: black;
`;

const Text = styled(Typography)`
    font-family: Lato;
    color: ${colors.black};
`;

const StyledLi = styled.li`
    line-height: 1.43;
    font-size: 16px;
    color: ${colors.black};
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
    font-size: 16px;
    color: ${colors.black};
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;
