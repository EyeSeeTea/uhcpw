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
import { colors } from "../app/themes/dhis2.theme";
import { COMBINED_POLICY_TABLES_CATEGORY_ID, usePolicyExplorer } from "./usePolicyExplorer";
import { PolicyExplorerFilters } from "../../components/policy-explorer/PolicyExplorerFilters";
import { EmptyContent } from "../../components/empty-content/EmptyContent";
import policyExplorer from "../../assets/policy-explorer.svg";
import { PolicyExplorerTable } from "./PolicyExplorerTable";
import {
    DataOrientation,
    PolicyExplorerCell,
    PolicyExplorerCellType,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME } from "../../../data/repositories/policy-explorer/PolicyExplorerD2Repository";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import mapBackground from "../../assets/map-background.jpg";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";

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

    const categories = useMemo(() => {
        return filters.category.options
            .filter(
                category =>
                    filters.category.selected && Object.keys(filters.category.selected)?.includes(category.value)
            )
            .map(category => {
                if (category.value === COMBINED_POLICY_TABLES_CATEGORY_ID && category.subcategories[0]) {
                    return {
                        ...category,
                        ...category.subcategories[0],
                    };
                } else {
                    return category;
                }
            });
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

                        {categories.map(category => (
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
                        {data?.generalInfo.map(info => {
                            return (
                                <div key={info.country}>
                                    <GeneralDataContainer>
                                        <GeneralRow>
                                            <CreditsText style={{ fontWeight: 500 }}>
                                                <strong>{`${info.country} (${info.year})`}</strong>
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

                                        <GeneralRow>
                                            <CreditsText $noWrap>
                                                {i18n.t("Experts: ", { nsSeparator: false })}
                                            </CreditsText>
                                            &nbsp;
                                            <CreditsText>{info.countryExperts}</CreditsText>
                                        </GeneralRow>

                                        <GeneralRow>
                                            <CreditsText>{i18n.t("Editors: ", { nsSeparator: false })}</CreditsText>
                                            &nbsp;
                                            <CreditsText>{info.editors}</CreditsText>
                                        </GeneralRow>

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
                                        {info.country && getCleanReferencesByCountry(info.country)?.length ? (
                                            <>
                                                <ReferencesTitle>
                                                    {i18n.t("References", { nsSeparator: false })}
                                                </ReferencesTitle>
                                                {getCleanReferencesByCountry(info.country)?.map(reference => (
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
    padding: 24px 200px 24px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${props => props.color} url(${mapBackground});
        background-position: center;
    }
`;

const Image = styled.img`
    height: 56px;
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
`;

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
