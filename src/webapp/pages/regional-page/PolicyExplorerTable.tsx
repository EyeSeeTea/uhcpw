import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import { PolicyExplorerCellType } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CategoryInfoDialog } from "../../components/dialog/CategoryInfoDialog";
import { PolicyExplorerTableValue } from "../../components/policy-explorer/PolicyExplorerTableValue";
import { TableLegend } from "../../components/policy-explorer/TableLegend";
import { Id } from "../../../domain/entities/Ref";
import { useRegionalPolicyExplorerTable } from "./useRegionalPolicyExplorerTable";

interface PolicyExplorerTableProps {
    countries: Id[];
    categoryId: string;
    years: string[];
}

export const PolicyExplorerTable: React.FC<PolicyExplorerTableProps> = React.memo(props => {
    const { countries, categoryId, years } = props;

    const { tableData, category, isNotesDialogOpen, setIsNotesDialogOpen, isLoading } = useRegionalPolicyExplorerTable(
        countries,
        categoryId,
        years
    );

    if (isLoading) {
        return (
            <Center>
                <CircularProgress />
            </Center>
        );
    }

    return tableData && category ? (
        <Container>
            <TableLegend categoryId={categoryId} />

            <TableContainer component={TablePaper} style={{ overflowX: "auto" }} className={categoryId}>
                <StyledTable aria-label="simple table">
                    <StyledTableBody className={categoryId + "-table"}>
                        {tableData?.map((row, index) => (
                            <TableRow key={`${categoryId}_${index}_${row.toString()}`}>
                                {row.map((cell, i) => (
                                    <StyledTableCell key={`${categoryId}_${i}_${cell.value}`} type={cell.type}>
                                        <PolicyExplorerTableValue cell={cell} />
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        ))}
                    </StyledTableBody>
                </StyledTable>
            </TableContainer>

            <CategoryInfoDialog
                isOpen={isNotesDialogOpen}
                onClose={() => setIsNotesDialogOpen(false)}
                category={category}
            />
        </Container>
    ) : null;
});

const TablePaper = styled(Paper)`
    border-radius: 0;
    box-shadow: none;
    margin-block-end: 36px;
    &:last-child {
        margin-block-end: 26px;
    }
`;

const StyledTableCell = styled(TableCell)<{ type: PolicyExplorerCellType }>`
    color: #0460a7;
    font-weight: 500;
    max-width: 70px;
    width: 70px;
    min-width: 70px;
    background-color: ${props => (props.type === PolicyExplorerCellType.HEADER ? "#d3e5f5" : "#f4f8fc")};
    color: ${props => (props.type === PolicyExplorerCellType.HEADER ? "#0460a7" : "black")};
`;

const StyledTable = styled(Table)`
    width: 100%;
    table-layout: fixed;
    border-spacing: 0.8px;
    border-collapse: initial;

    tbody > tr > td {
        vertical-align: top;
    }
`;

const StyledTableBody = styled(TableBody)`
    &.u800TAhsIBY_Cat-table,
    &.Nx6S3aQkvWe-table {
        tr > td:first-child {
            text-align: left;
        }

        td {
            text-align: center;
            vertical-align: middle;
        }
    }
`;

const Container = styled.div``;

const Center = styled.div`
    height: 350px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
