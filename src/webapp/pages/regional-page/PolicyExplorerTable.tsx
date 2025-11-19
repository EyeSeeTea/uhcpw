import _ from "lodash";
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import { PolicyExplorerCellType, DataOrientation } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CategoryInfoDialog } from "../../components/dialog/CategoryInfoDialog";
import { CATEGORY_BY_TYPE_OF_HEALTHCARE } from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { PolicyExplorerTableValue } from "../../components/policy-explorer/PolicyExplorerTableValue";
import { TableLegend } from "../../components/policy-explorer/TableLegend";
import { Id } from "../../../domain/entities/Ref";
import { useRegionalPolicyExplorerTable } from "./useRegionalPolicyExplorerTable";

interface PolicyExplorerTableProps {
    countries: Id[];
    categoryId: string;
    years: string[];
}

const CELLS_WIDTH_CATEGORY_BY_TYPE_OF_HEALTHCARE = {
    country: 10,
    year: 10,
    typeOfHealthCare: 10,
    userChargesApply: 90,
    typeOfUserCharge: 160,
    reducedUserCharges: 90,
    exemptionsFromUserCharges: 160,
    capOnUserCharges: 90,
};

export const PolicyExplorerTable: React.FC<PolicyExplorerTableProps> = React.memo(props => {
    const { countries, categoryId, years } = props;

    const { tableData, category, isNotesDialogOpen, setIsNotesDialogOpen, isLoading } = useRegionalPolicyExplorerTable(
        countries,
        categoryId,
        years
    );

    const getCellWidth = React.useCallback(
        columnIndex => {
            const columnName = _.camelCase(tableData?.[0]?.[columnIndex]?.value);

            if (
                categoryId === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES &&
                columnName &&
                columnName in CELLS_WIDTH_CATEGORY_BY_TYPE_OF_HEALTHCARE
            ) {
                return CELLS_WIDTH_CATEGORY_BY_TYPE_OF_HEALTHCARE[
                    columnName as keyof typeof CELLS_WIDTH_CATEGORY_BY_TYPE_OF_HEALTHCARE
                ];
            }
        },
        [categoryId, tableData]
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
                <StyledTable orientation="normal">
                    <StyledTableBody className={categoryId + "-table"}>
                        {tableData?.map((row, index) => (
                            <TableRow key={`${categoryId}_${index}_${row.toString()}`}>
                                {row.map((cell, i) => (
                                    <StyledTableCell
                                        key={`${categoryId}_${i}_${cell.value}`}
                                        type={cell.type}
                                        cellwidth={getCellWidth(i)}
                                    >
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

export const StyledTable: React.FC<{ orientation: DataOrientation }> = ({ orientation, children }) => {
    return orientation === "normal" ? (
        <StyledNormalTable aria-label="simple table">{children}</StyledNormalTable>
    ) : (
        <StyledInvertedTable aria-label="simple table">{children}</StyledInvertedTable>
    );
};

const TablePaper = styled(Paper)`
    border-radius: 10px;
    box-shadow: none;
    margin-block-end: 36px;
    &:last-child {
        margin-block-end: 26px;
    }
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
`;

const StyledTableCell = styled(TableCell)<{ type: PolicyExplorerCellType; cellwidth?: number }>`
    color: #0460a7;
    font-weight: 500;
    width: ${props => (props.cellwidth ? `${props.cellwidth}px` : "initial")};
    min-width: ${props => (props.cellwidth ? `${props.cellwidth}px` : "initial")};
    background-color: ${props => (props.type === PolicyExplorerCellType.HEADER ? "#d3e5f5" : "#f4f8fc")};
    color: ${props => (props.type === PolicyExplorerCellType.HEADER ? "#0460a7" : "black")};
`;

const StyledInvertedTable = styled(Table)`
    border-spacing: 0.8px;
    border-collapse: initial;
    tbody > tr > td {
        vertical-align: top;
    }
`;

const StyledTableBody = styled(TableBody)`
    &.u800TAhsIBY_Cat-table,
    &.Nx6S3aQkvWe-table {
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
