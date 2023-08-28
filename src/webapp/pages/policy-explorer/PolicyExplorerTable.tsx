import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import InfoIcon from "@material-ui/icons/Info";
import SwitchIcon from "@material-ui/icons/Cached";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import ReactMarkdown from "react-markdown";
import { DataOrientation } from "./PolicyExplorerState";
import { CategoryOption } from "../../components/policy-explorer/category-selector/CategorySelector";
import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../domain/entities/policy-explorer/PolicyExplorer";

interface PolicyExplorerTableProps {
    category: CategoryOption;
    rows?: PolicyExplorerCell[][];
    dataOrientation?: DataOrientation;
    onSwitchRowColumn: (categoryId: string) => void;
    onDownload: (categoryId: string) => void;
}

export const PolicyExplorerTable = React.memo(
    ({ category, rows, onSwitchRowColumn, onDownload, dataOrientation }: PolicyExplorerTableProps) => {
        if (!rows || !dataOrientation) return null;
        return (
            <>
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
                                onClick={() => onSwitchRowColumn(category.value)}
                            >
                                {i18n.t("Switch row/column")}
                            </CustomButton>
                            <CustomButton
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                color="primary"
                                style={{ marginLeft: 20 }}
                                onClick={() => onDownload(category.value)}
                            >
                                {i18n.t("Download")}
                            </CustomButton>
                        </Row>
                    </Row>
                </TableHeader>
                <TableContainer component={TablePaper}>
                    <StyledTable orientation={dataOrientation}>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={`${category.value}_${index}_${row.toString()}`}>
                                    {row.map((cell, i) => (
                                        <StyledTableCell key={`${category.value}_${i}_${cell.value}`} type={cell.type}>
                                            <ReactMarkdown>{cell.value}</ReactMarkdown>
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                </TableContainer>
            </>
        );
    }
);

export const StyledTable: React.FC<{ orientation: DataOrientation }> = ({ orientation, children }) => {
    return orientation === "normal" ? (
        <StyledNormalTable aria-label="simple table">{children}</StyledNormalTable>
    ) : (
        <StyledInvertedTable aria-label="simple table">{children}</StyledInvertedTable>
    );
};

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

const StyledNormalTable = styled(Table)`
    border-spacing: 0.8px;
    border-collapse: initial;
    tbody > tr:first-child > td {
        vertical-align: middle;
    }
    tbody > tr > td {
        vertical-align: top;
    }
    margin-bottom: 64px;
`;

const StyledTableCell = styled(TableCell)<{ type: PolicyExplorerCellType }>`
    color: #0460a7;
    font-weight: 500;
    background-color: ${props => (props.type === PolicyExplorerCellType.HEADER ? "#d3e5f5" : "#f4f8fc")};
    color: ${props => (props.type === PolicyExplorerCellType.HEADER ? "#0460a7" : "black")};
`;

const StyledInvertedTable = styled(Table)`
    border-spacing: 0.8px;
    border-collapse: initial;
    tbody > tr > td {
        vertical-align: top;
    }
    margin-bottom: 64px;
`;
