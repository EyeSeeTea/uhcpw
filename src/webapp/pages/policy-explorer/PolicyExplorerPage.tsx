import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import moment from "moment";
import styled from "styled-components";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import ReactMarkdown from "react-markdown";

import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { usePolicyExplorer } from "./usePolicyExplorer";
import { PolicyExplorerFilters } from "../../components/policy-explorer/PolicyExplorerFilters";
import { EmptyContent } from "../../components/empty-content/EmptyContent";
import policyExplorer from "../../assets/policy-explorer.svg";
import { PolicyExplorerTable } from "./PolicyExplorerTable";

export const PolicyExplorerPage: React.FC<{ searchParams?: string }> = React.memo(props => {
    const snackbar = useSnackbar();

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
    } = usePolicyExplorer({
        countriesFilter: filterInParams.country,
        categories: filterInParams.category,
        yearsFilter: filterInParams.year,
    });

    useEffect(() => {
        if (errorMessage) {
            snackbar.error(i18n.t(errorMessage));
        }
    }, [errorMessage, snackbar]);

    const categories = useMemo(() => {
        return filters.category.options.filter(
            category => filters.category.selected && Object.keys(filters.category.selected)?.includes(category.value)
        );
    }, [filters.category]);

    const getCleanReferencesByCountry = useCallback(
        (country: string) => {
            return data?.references
                ?.find(references => references.country === country)
                ?.references?.map(reference => {
                    return reference.split("]:")[1]?.replace(/"/g, "") || reference;
                });
        },
        [data?.references]
    );

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("Policy explorer")}</Typography>
                <Image src={policyExplorer} alt={i18n.t("policy explorer")} />
            </TitleContainer>

            <MainSection>
                <PolicyExplorerFilters filters={filters} onGetTable={onGetTable} />

                {data && dataOrientationByTable ? (
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
                            />
                        ))}
                    </Content>
                ) : (
                    <EmptyContent info={selectCategoryInfo} />
                )}

                <div ref={referencesRef}>
                    {data?.generalInfo.map(info => {
                        return (
                            <div key={info.country}>
                                <GeneralDataContainer>
                                    <GeneralRow>
                                        <CreditsText
                                            style={{ fontWeight: 500 }}
                                        >{`${info.country} (${info.year})`}</CreditsText>
                                    </GeneralRow>

                                    {info.lastUpdate ? (
                                        <GeneralRow>
                                            <CreditsText $noWrap>
                                                {i18n.t("Last updated: ", { nsSeparator: false })}
                                            </CreditsText>
                                            &nbsp;
                                            <CreditsText>{moment(info.lastUpdate).format("D MMMM YYYY")}</CreditsText>
                                        </GeneralRow>
                                    ) : null}

                                    <GeneralRow>
                                        <CreditsText $noWrap>{i18n.t("Experts: ", { nsSeparator: false })}</CreditsText>
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
                                            <CreditsText>{i18n.t("Reviewers: ", { nsSeparator: false })}</CreditsText>
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
                                                <Link href={info.sourceUrl} target="_blank" rel="noreferrer">
                                                    {info.sourceText}
                                                </Link>
                                            ) : (
                                                <CreditsText>{info.sourceText}</CreditsText>
                                            )}
                                        </GeneralRow>
                                    ) : null}
                                </GeneralDataContainer>
                                <ReferencesContainer>
                                    {info.country &&
                                        getCleanReferencesByCountry(info.country)?.map(reference => (
                                            <ReactMarkdown
                                                key={reference}
                                                components={{
                                                    p: ({ children }) => <ReferenceText>{children}</ReferenceText>,
                                                }}
                                            >
                                                {reference}
                                            </ReactMarkdown>
                                        ))}
                                </ReferencesContainer>
                            </div>
                        );
                    })}
                </div>
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
    margin-bottom: 24px;
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
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 48px 200px 48px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Image = styled.img`
    width: 160px;
    height: 160px;
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
