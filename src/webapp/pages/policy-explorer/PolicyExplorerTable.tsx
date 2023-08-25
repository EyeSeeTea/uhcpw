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

interface PolicyExplorerTableProps {
    category: CategoryOption;
    rows?: string[][];
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
                                        <TableCell key={`${category.value}_${i}_${cell}`}>
                                            <ReactMarkdown>{cell}</ReactMarkdown>
                                        </TableCell>
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
