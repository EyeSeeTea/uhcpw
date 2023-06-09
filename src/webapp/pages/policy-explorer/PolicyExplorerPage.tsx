import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { usePolicyExplorer } from "./usePolicyExplorer";
import InfoIcon from "@material-ui/icons/Info";
import SwitchIcon from "@material-ui/icons/Cached";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { PolicyExplorerFilters } from "../../components/policy-explorer/PolicyExplorerFilters";
import { EmptyContent } from "../../components/policy-explorer/EmptyContent";
import ReactMarkdown from "react-markdown";
import { DataOrientation } from "./PolicyExplorerState";
import moment from "moment";

export const PolicyExplorerPage: React.FC = React.memo(() => {
    const { filters, data, onSwitchRowColumn, onDownload, dataOrientation } = usePolicyExplorer();

    const category = useMemo(() => {
        return filters.category.options.find(cat => cat.value === filters.category.selected);
    }, [filters.category]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Policy Explorer")}</Typography>
                <Typography variant="body1" style={{ maxWidth: "600px", padding: "8px 0px" }}>
                    {i18n.t(
                        "Track and compare policies on population coverage, service coverage, user charges and voluntary health insurance and explore gaps in coverage"
                    )}
                </Typography>
            </TitleContainer>

            <MainSection>
                <PolicyExplorerFilters filters={filters} />

                {data && (
                    <TableHeader>
                        <Row>
                            {category && (
                                <Row>
                                    <Typography variant="h6" color="primary">
                                        {category.text}
                                    </Typography>
                                    <Button>
                                        <InfoIcon color="primary" />
                                    </Button>
                                </Row>
                            )}
                            <Row>
                                <CustomButton
                                    variant="outlined"
                                    startIcon={<SwitchIcon />}
                                    color="primary"
                                    onClick={onSwitchRowColumn}
                                >
                                    {i18n.t("Switch row/column")}
                                </CustomButton>
                                <CustomButton
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    color="primary"
                                    style={{ marginLeft: 20 }}
                                    onClick={onDownload}
                                >
                                    {i18n.t("Download")}
                                </CustomButton>
                            </Row>
                        </Row>
                    </TableHeader>
                )}
                {data ? (
                    <TableContainer component={TablePaper}>
                        <StyledTable orientation={dataOrientation}>
                            <TableBody>
                                {data.rows.map(row => (
                                    <TableRow key={row.toString()}>
                                        {row.map(cell => (
                                            <TableCell key={cell}>
                                                <ReactMarkdown>{cell}</ReactMarkdown>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </StyledTable>
                    </TableContainer>
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
                                <Link href={info.source} style={{ fontSize: "16px", color: colors.accentPrimary }}>
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

export const StyledTable: React.FC<{ orientation: DataOrientation }> = ({ orientation, children }) => {
    return orientation === "normal" ? (
        <StyledNormalTable aria-label="simple table">{children}</StyledNormalTable>
    ) : (
        <StyledInvertedTable aria-label="simple table">{children}</StyledInvertedTable>
    );
};

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
    padding: 48px 64px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const GeneralRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
`;

const TableHeader = styled.div`
    padding: 48px 0px;
`;

const CustomButton = styled(Button)`
    border-radius: 10px;
    padding: 0px 16px;
`;

const TablePaper = styled(Paper)`
    border-radius: 10px;
    box-shadow: none;
`;

const StyledNormalTable = styled(Table)`
    tbody {
        background: #f4f8fc;
    }
    tbody > tr:first-child > td {
        background-color: #d3e5f5;
    }

    tbody > tr:first-child > td {
        color: #0460a7;
        font-weight: 500;
    }
    tbody > tr:first-child > td {
        vertical-align: middle;
    }
    tbody > tr > td {
        vertical-align: top;
    }
    margin-bottom: 64px;
`;

const StyledInvertedTable = styled(Table)`
    tbody {
        background: #f4f8fc;
    }

    tbody > tr > td:first-child {
        background-color: #d3e5f5;
    }
    tbody > tr > td:first-child {
        color: #0460a7;
        font-weight: 500;
    }
    tbody > tr > td {
        vertical-align: top;
    }
    margin-bottom: 64px;
`;

const CreditsText = styled(Typography)`
    color: black;
    font-weight: 300;
`;

const Link = styled.a`
    text-decoration: none;
`;
