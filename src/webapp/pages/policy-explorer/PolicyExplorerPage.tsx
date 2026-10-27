import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { Typography, Button, CircularProgress } from "@material-ui/core";
import moment from "moment";
import styled from "styled-components";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import ReactMarkdown from "react-markdown";
import _ from "lodash";

import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { ExplainerVideoButton } from "../../components/explainer-video/ExplainerVideoButton";
import { colors } from "../app/themes/dhis2.theme";
import { usePolicyExplorer } from "./usePolicyExplorer";
import { PolicyExplorerFilters } from "../../components/policy-explorer/PolicyExplorerFilters";
import { EmptyContent } from "../../components/empty-content/EmptyContent";
import policyExplorer from "../../assets/policy-explorer.svg";
import { PolicyExplorerTable } from "./PolicyExplorerTable";
import {
    DataOrientation,
    PolicyExplorerGeneralInfo,
    PolicyExplorerCell,
    PolicyExplorerCellType,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME } from "../../../data/repositories/policy-explorer/PolicyExplorerD2Repository";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import mapBackground from "../../assets/map-background.jpg";
import {
    BREAKPOINT_WIDTH_MOBILE_SCREEN,
    BREAKPOINT_WIDTH_SMALL_SCREEN,
} from "../../common/hooks/screen/useIsSmallScreen";
import {
    CategoryOption,
    CategorySelectableOption,
} from "../../components/policy-explorer/category-selector/useCategorySelector";

export const PolicyExplorerPage: React.FC<{ searchParams?: string }> = React.memo(props => {
    const snackbar = useSnackbar();

    const { sendPageView, redirectWithExternalLink } = useAnalytics();

    const referencesRef = useRef<HTMLDivElement>(null);

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(props.searchParams);

        const paramsCategory = searchParams.get("category");
        const country = searchParams.get("country");
        const year = searchParams.get("year");

        const category = paramsCategory ? (JSON.parse(paramsCategory) as Record<string, string[]>) : undefined;

        return {
            category: category ? category : undefined,
            country: country ? country.split(",") : undefined,
            year: year ? year.split(",") : undefined,
        };
    }, [props.searchParams]);

    const {
        filters,
        data,
        onGetTable,
        onSwitchRowColumn,
        onDownload,
        dataOrientationByTable,
        selectCategoryInfo,
        errorMessage,
        isLoading,
    } = usePolicyExplorer({
        countriesFilter: filterInParams.country,
        categories: filterInParams.category,
        yearsFilter: filterInParams.year,
    });

    useEffect(() => {
        sendPageView({ title: "Policy explorer" });
    }, [sendPageView]);

    useEffect(() => {
        if (errorMessage) {
            snackbar.error(i18n.t(errorMessage));
        }
    }, [errorMessage, snackbar]);

    const selectedCategories = useMemo(() => {
        return filters.category.options.reduce(
            (accSelected: CategorySelectableOption[], category: CategoryOption): CategorySelectableOption[] => {
                if (category.type === "group") {
                    const selectedSubcategories = category.categories.filter(
                        selectableCategory =>
                            filters.category.selected &&
                            Object.keys(filters.category.selected)?.includes(selectableCategory.value)
                    );
                    return [...accSelected, ...selectedSubcategories];
                } else {
                    return category.type === "selectable" &&
                        filters.category.selected &&
                        Object.keys(filters.category.selected)?.includes(category.value)
                        ? [...accSelected, category]
                        : accSelected;
                }
            },
            []
        );
    }, [filters.category]);

    const getCleanReferencesByCountry = useCallback(
        (country: string) => {
            return _.compact(
                data?.references
                    ?.find(references => references.country === country)
                    ?.references?.map(reference => reference.split("]:")[1]?.replace(/"/g, "") || reference)
            );
        },
        [data?.references]
    );

    const checkIfMoreThanOneCountry = useCallback(
        (dataOrientation: DataOrientation | undefined, rows: PolicyExplorerCell[][] | undefined) => {
            if (dataOrientation === "normal" && rows?.length) {
                const countryColumnIndex = rows[0]?.findIndex(
                    cell => cell.type === PolicyExplorerCellType.HEADER && cell.value === COUNTRY_HEADER_NAME
                );

                return countryColumnIndex !== undefined && countryColumnIndex !== -1
                    ? rows?.filter(
                          row =>
                              row[countryColumnIndex]?.value && row[countryColumnIndex]?.value !== COUNTRY_HEADER_NAME
                      ).length > 1
                    : false;
            }

            if (dataOrientation === "inverted" && rows?.length) {
                const countryRowIndex = rows.findIndex(
                    row => row[0]?.type === PolicyExplorerCellType.HEADER && row[0]?.value === COUNTRY_HEADER_NAME
                );

                const countryRow = rows[countryRowIndex];

                return countryRow
                    ? countryRow?.filter(cell => cell?.value && cell?.value !== COUNTRY_HEADER_NAME)?.length > 1
                    : false;
            }
            return false;
        },
        []
    );

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("Policy explorer")}</Typography>
                <Image src={policyExplorer} alt={i18n.t("policy explorer")} />
                <ExplainerVideoButton page="policyExplorer" smallScreenVariant="light" />
            </TitleContainer>

            <MainSection>
                <PolicyExplorerFilters filters={filters} onGetTable={onGetTable} disableGet={isLoading} />

                {isLoading && (
                    <Center>
                        <CircularProgress />
                    </Center>
                )}

                {!isLoading && data && dataOrientationByTable && (
                    <Content>
                        <DownloadButton
                            aria-label="Download"
                            variant="contained"
                            endIcon={<DownloadIcon />}
                            color="primary"
                            onClick={onDownload}
                            className="download-button"
                        >
                            <Typography>{i18n.t("Download")}</Typography>
                        </DownloadButton>

                        {selectedCategories.map(category => (
                            <PolicyExplorerTable
                                key={category.value}
                                category={category}
                                rows={data.tables[category.value]}
                                onSwitchRowColumn={onSwitchRowColumn}
                                dataOrientation={dataOrientationByTable[category.value]}
                                referencesRef={referencesRef}
                                hasMoreThanOneCountry={checkIfMoreThanOneCountry(
                                    dataOrientationByTable[category.value],
                                    data.tables[category.value]
                                )}
                            />
                        ))}
                    </Content>
                )}

                {!isLoading && !(data && dataOrientationByTable) && <EmptyContent info={selectCategoryInfo} />}

                {!isLoading && (
                    <div ref={referencesRef}>
                        {data?.generalInfo
                            .map(info => {
                                const countryReferences = getCleanReferencesByCountry(info.country);
                                const hasGeneralInfoContent = Boolean(
                                    info.year ||
                                        info.lastUpdate ||
                                        info.countryExperts ||
                                        info.editors ||
                                        info.reviewers ||
                                        info.notes ||
                                        info.sourceText ||
                                        countryReferences?.length
                                );

                                if (!hasGeneralInfoContent) return null;

                                return { info, countryReferences };
                            })
                            .filter(
                                (
                                    item
                                ): item is {
                                    info: PolicyExplorerGeneralInfo;
                                    countryReferences: string[];
                                } => item !== null
                            )
                            .map(({ info, countryReferences }) => {
                                return (
                                    <div key={info.country}>
                                        <GeneralDataContainer>
                                            <GeneralRow>
                                                <CreditsText style={{ fontWeight: 500 }}>
                                                    <strong>
                                                        {info.year ? `${info.country} (${info.year})` : info.country}
                                                    </strong>
                                                </CreditsText>
                                            </GeneralRow>

                                            {info.lastUpdate ? (
                                                <GeneralRow>
                                                    <CreditsText $noWrap>
                                                        {i18n.t("Last updated: ", { nsSeparator: false })}
                                                    </CreditsText>
                                                    &nbsp;
                                                    <CreditsText>
                                                        {moment(info.lastUpdate).format("D MMMM YYYY")}
                                                    </CreditsText>
                                                </GeneralRow>
                                            ) : null}

                                            {info.countryExperts ? (
                                                <GeneralRow>
                                                    <CreditsText $noWrap>
                                                        {i18n.t("Experts: ", { nsSeparator: false })}
                                                    </CreditsText>
                                                    &nbsp;
                                                    <CreditsText>{info.countryExperts}</CreditsText>
                                                </GeneralRow>
                                            ) : null}

                                            {info.editors ? (
                                                <GeneralRow>
                                                    <CreditsText>
                                                        {i18n.t("Editors: ", { nsSeparator: false })}
                                                    </CreditsText>
                                                    &nbsp;
                                                    <CreditsText>{info.editors}</CreditsText>
                                                </GeneralRow>
                                            ) : null}

                                            {info.reviewers ? (
                                                <GeneralRow>
                                                    <CreditsText>
                                                        {i18n.t("Reviewers: ", { nsSeparator: false })}
                                                    </CreditsText>
                                                    &nbsp;
                                                    <CreditsText>{info.reviewers}</CreditsText>
                                                </GeneralRow>
                                            ) : null}

                                            {info.notes ? (
                                                <GeneralRow>
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ children }) => (
                                                                <CreditsText variant="caption">{children}</CreditsText>
                                                            ),
                                                        }}
                                                    >
                                                        {`${i18n.t("Notes: ", {
                                                            nsSeparator: false,
                                                        })} ${info.notes}`}
                                                    </ReactMarkdown>
                                                </GeneralRow>
                                            ) : null}

                                            {info.sourceText ? (
                                                <GeneralRow>
                                                    <CreditsText>
                                                        {i18n.t("Suggested citation: ", { nsSeparator: false })}
                                                    </CreditsText>
                                                    &nbsp;
                                                    {info.sourceUrl ? (
                                                        <Link
                                                            href={info.sourceUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={redirectWithExternalLink}
                                                        >
                                                            {info.sourceText}
                                                        </Link>
                                                    ) : (
                                                        <CreditsText>{info.sourceText}</CreditsText>
                                                    )}
                                                </GeneralRow>
                                            ) : null}
                                        </GeneralDataContainer>
                                        <ReferencesContainer>
                                            {info.country && countryReferences?.length ? (
                                                <>
                                                    <ReferencesTitle>
                                                        {i18n.t("References", { nsSeparator: false })}
                                                    </ReferencesTitle>
                                                    {countryReferences?.map(reference => (
                                                        <ReactMarkdown
                                                            key={reference}
                                                            components={{
                                                                p: ({ children }) => (
                                                                    <ReferenceText>{children}</ReferenceText>
                                                                ),
                                                            }}
                                                        >
                                                            {reference}
                                                        </ReactMarkdown>
                                                    ))}
                                                </>
                                            ) : null}
                                        </ReferencesContainer>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </MainSection>
        </Layout>
    );
});

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

const GeneralDataContainer = styled.div`
    font-size: 16px;
    margin-top: 24px;
`;

const ReferencesContainer = styled.div`
    margin-bottom: 24px;
`;

const ReferenceText = styled(Typography)`
    color: black;
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: 12px;
`;

const MainSection = styled.div`
    background: white;
    padding: 48px 64px;
    @media (max-width: 600px) {
        padding: 34px 64px;
    }
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 24px 64px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px 32px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${props => props.color} url(${mapBackground});
        background-position: center;

        > h3 {
            flex-basis: 100%;
        }
    }
`;

const Image = styled.img`
    height: 56px;
    margin-inline-start: auto;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        order: 1;
    }
`;

const GeneralRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    margin-bottom: 12px;
`;

const CreditsText = styled(Typography)<{ $noWrap?: boolean }>`
    color: black;
    font-weight: 500;
    font-size: 0.875rem;
    white-space: ${props => (props.$noWrap ? "nowrap" : "unset")};
    font-family: Lato;
`;

const ReferencesTitle = styled(Typography)`
    color: black;
    font-weight: 500;
    font-size: 0.875rem;
    font-family: Lato;
    margin-bottom: 12px;
`;

const Link = styled.a`
    text-transform: none;
    text-decoration: none;
    font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
    color: black;
    font-weight: 500;
    font-size: 0.875rem;
    white-space: unset;
    line-height: 1.5;
`;

const DownloadButton = styled(Button)`
    border-radius: 20px;
    padding: 0px 32px;
    height: 42px;
    width: 170px;
    text-transform: initial;
    align-self: flex-end;
    margin-block-start: 20px;
    background: #185698;

    @media (max-width: ${BREAKPOINT_WIDTH_MOBILE_SCREEN}px) {
        height: 50px;
        width: 100%;
        margin-block-start: 26px;
        justify-content: center;
        padding: 6px 16px;
    }
`;

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
