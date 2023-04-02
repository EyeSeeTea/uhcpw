import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { usePolicyExplorer } from "./usePolicyExplorer";
import InfoIcon from "@material-ui/icons/Info";
import SwitchIcon from "@material-ui/icons/Cached";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { PolicyExplorerFilters } from "../../components/policy-explorer/resources-filters/PolicyExplorerFilters";

export const PolicyExplorerPage: React.FC = React.memo(() => {
    const { filters, data, onSwitchRowColumn } = usePolicyExplorer();

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

                <TableHeader>
                    <Row>
                        <Row>
                            <Typography variant="h6" color="primary">
                                {i18n.t("Population Coverage")}
                            </Typography>
                            <Button>
                                <InfoIcon color="primary" />
                            </Button>
                        </Row>
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
                            >
                                {i18n.t("Download")}
                            </CustomButton>
                        </Row>
                    </Row>
                </TableHeader>
                <TableContainer component={TablePaper}>
                    <StyledTable aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {data.columns.map(column => {
                                    return <TableCell key={column}>{column}</TableCell>;
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.rows.map(row => (
                                <TableRow key={row.toString()}>
                                    {row.map(cell => (
                                        <TableCell key={cell}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                </TableContainer>
                <span>
                    <CreditsText variant="caption">{i18n.t("Source: ")}</CreditsText>
                    <Link href="#">
                        <Typography variant="caption">
                            {i18n.t("WHO Barcelona Office for Health Systems Financing (2022)")}
                        </Typography>
                    </Link>
                </span>
                <br />
                <span>
                    <CreditsText variant="caption">{i18n.t("data last updated: ")}</CreditsText>
                    <CreditsText variant="caption">{i18n.t("15 June 2020")}</CreditsText>
                </span>
            </MainSection>
        </Layout>
    );
});

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

const StyledTable = styled(Table)`
    tbody {
        background: #f2f9fd;
    }
    thead > tr > th:nth-child(odd) {
        background-color: #cce8f7;
    }
    thead > tr > th:nth-child(even) {
        background-color: #e7f3fc;
    }
    thead > tr > th {
        color: #0460a7;
    }
    thead > tr > th {
        vertical-align: middle;
    }
    tbody > tr > td {
        vertical-align: top;
    }
    margin-bottom: 64px;
`;

const CreditsText = styled(Typography)`
    color: grey;
`;

const Link = styled.a`
    text-decoration: none;
`;
