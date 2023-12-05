import { Typography } from "@material-ui/core";
import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { usePolicyExplorer } from "./usePolicyExplorer";
import { PolicyExplorerFilters } from "../../components/policy-explorer/PolicyExplorerFilters";
import { EmptyContent } from "../../components/policy-explorer/EmptyContent";
import moment from "moment";
import policyExplorer from "../../assets/policy-explorer.svg";
import { PolicyExplorerTable } from "./PolicyExplorerTable";

export const PolicyExplorerPage: React.FC<{ searchParams?: string }> = React.memo(props => {
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

    const { filters, data, onGetTable, onSwitchRowColumn, onDownload, dataOrientationByTable } = usePolicyExplorer({
        countriesFilter: filterInParams.country,
        categories: filterInParams.category,
        yearsFilter: filterInParams.year,
    });

    const categories = useMemo(() => {
        return filters.category.options.filter(
            category => filters.category.selected && Object.keys(filters.category.selected)?.includes(category.value)
        );
    }, [filters.category]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("Policy explorer")}</Typography>
                <Image src={policyExplorer} alt={i18n.t("policy explorer")} />
            </TitleContainer>

            <MainSection>
                <PolicyExplorerFilters filters={filters} onGetTable={onGetTable} />

                {data && dataOrientationByTable ? (
                    categories.map(category => (
                        <PolicyExplorerTable
                            key={category.value}
                            category={category}
                            rows={data.tables[category.value]}
                            onSwitchRowColumn={onSwitchRowColumn}
                            onDownload={onDownload}
                            dataOrientation={dataOrientationByTable[category.value]}
                            referencesRef={referencesRef}
                        />
                    ))
                ) : (
                    <EmptyContent />
                )}

                <div ref={referencesRef}>
                    {data?.generalInfo.map(info => {
                        return (
                            <div key={info.country}>
                                <GeneralDataContainer>
                                    <GeneralRow>
                                        <CreditsText
                                            style={{ fontWeight: 500 }}
                                        >{`${info.country} (2023)`}</CreditsText>
                                    </GeneralRow>

                                    <GeneralRow>
                                        <CreditsText>{i18n.t("Source: ", { nsSeparator: false })}</CreditsText>
                                        &nbsp;
                                        <Link
                                            href={info.source}
                                            style={{ fontSize: "16px", color: colors.accentPrimary }}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {i18n.t("WHO Barcelona Office for Health Systems Financing (2023)")}
                                        </Link>
                                    </GeneralRow>

                                    <GeneralRow>
                                        <CreditsText>{i18n.t("Country experts: ", { nsSeparator: false })}</CreditsText>
                                        &nbsp;
                                        <CreditsText>{info.countryExperts}</CreditsText>
                                    </GeneralRow>

                                    <GeneralRow>
                                        <CreditsText>{i18n.t("Editors: ", { nsSeparator: false })}</CreditsText>
                                        &nbsp;
                                        <CreditsText>{info.editors}</CreditsText>
                                    </GeneralRow>

                                    <GeneralRow>
                                        <CreditsText>{i18n.t("Last updated: ", { nsSeparator: false })}</CreditsText>
                                        &nbsp;
                                        <CreditsText>{moment(info.lastUpdate).format("DD MMMM YYYY")}</CreditsText>
                                    </GeneralRow>
                                </GeneralDataContainer>
                                <ReferencesContainer>
                                    {data?.references
                                        ?.find(references => references.country === info.country)
                                        ?.references?.map(reference => (
                                            <ReferenceText key={reference}>{reference}</ReferenceText>
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
    align-items: center;
    margin-bottom: 12px;
`;

const CreditsText = styled(Typography)`
    color: black;
    font-weight: 500;
    font-size: 0.875rem;
`;

const Link = styled.a`
    text-decoration: none;
`;
