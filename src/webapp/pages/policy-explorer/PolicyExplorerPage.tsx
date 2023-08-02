import { Typography } from "@material-ui/core";
import React, { useMemo } from "react";
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

export const PolicyExplorerPage: React.FC = React.memo(() => {
    const { filters, data, onGetTable, onSwitchRowColumn, onDownload, dataOrientationByTable } = usePolicyExplorer();

    const categories = useMemo(() => {
        return filters.category.options.filter(
            category => filters.category.selected && Object.keys(filters.category.selected)?.includes(category.value)
        );
    }, [filters.category]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Policy explorer")}</Typography>
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
                        />
                    ))
                ) : (
                    <EmptyContent />
                )}

                {data?.generalInfo.map(info => {
                    return (
                        <GeneralDataContainer key={info.country}>
                            <GeneralRow>
                                <CreditsText style={{ fontWeight: 500 }}>{`${info.country} (2023)`}</CreditsText>
                            </GeneralRow>

                            <GeneralRow>
                                <CreditsText>{i18n.t("Source: ")}</CreditsText>
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
                                <CreditsText>{i18n.t("Country experts: ")}</CreditsText>
                                &nbsp;
                                <CreditsText>{info.countryExperts}</CreditsText>
                            </GeneralRow>

                            <GeneralRow>
                                <CreditsText>{i18n.t("Editors: ")}</CreditsText>
                                &nbsp;
                                <CreditsText>{info.editors}</CreditsText>
                            </GeneralRow>

                            <GeneralRow>
                                <CreditsText>{i18n.t("Last updated: ")}</CreditsText>
                                &nbsp;
                                <CreditsText>{moment(info.lastUpdate).format("DD MMMM YYYY")}</CreditsText>
                            </GeneralRow>
                        </GeneralDataContainer>
                    );
                })}
            </MainSection>
        </Layout>
    );
});

const GeneralDataContainer = styled.div`
    font-size: 16px;
    margin-bottom: 24px;
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
    font-weight: 300;
`;

const Link = styled.a`
    text-decoration: none;
`;
