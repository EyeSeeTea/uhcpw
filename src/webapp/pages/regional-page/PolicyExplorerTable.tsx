import {
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";

import { PolicyExplorerCellType } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CategoryInfoDialog } from "../../components/dialog/CategoryInfoDialog";
import { PolicyExplorerTableValue } from "../../components/policy-explorer/PolicyExplorerTableValue";
import { TableLegend } from "../../components/policy-explorer/TableLegend";
import { Id } from "../../../domain/entities/Ref";
import { useRegionalPolicyExplorerTable } from "./useRegionalPolicyExplorerTable";
import { colors } from "../app/themes/dhis2.theme";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";

interface PolicyExplorerTableProps {
    title: string;
    countries: Id[];
    categoryId: string;
    years: string[];
}

export const PolicyExplorerTable: React.FC<PolicyExplorerTableProps> = React.memo(props => {
    const { title, countries, categoryId, years } = props;

    const { tableData, category, isNotesDialogOpen, setIsNotesDialogOpen, isLoading } = useRegionalPolicyExplorerTable(
        countries,
        categoryId,
        years
    );

    // TODO: check the other PolicyExplorerTable component in PE and try to unify this functionality
    // Function to create and synchronize the double scroll bar
    const doubleScroll = (element: HTMLDivElement | null) => {
        if (!element) return;
        const className = `custom-scrollbar-${category?.value}`;

        const existingScrollbar = element.parentNode?.querySelector(`.${className}`);

        if (existingScrollbar) {
            existingScrollbar.remove();
        }

        const scrollbar = document.createElement("div");
        scrollbar.appendChild(document.createElement("div"));
        scrollbar.style.overflow = "auto";
        scrollbar.style.overflowY = "hidden";
        scrollbar.style.position = "relative";
        scrollbar.style.top = "15px"; // Maybe calculate this dynamically

        const style = document.createElement("style");
        style.innerHTML = `
                    .${className} {
                        scrollbar-color: ${colors.accentPrimaryLight} ${colors.accentPrimaryLightest};
                        scrollbar-width: thin;
                    }
    
                    .${className}::-webkit-scrollbar {
                        width: 10px;
                    }
    
                    .${className}::-webkit-scrollbar-track {
                        background:  ${colors.accentPrimaryLightest};
                    }
    
                    .${className}::-webkit-scrollbar-thumb {
                        background-color: ${colors.accentPrimaryLight};
                        border-radius: 10px;
                    }
    
                    .${className}::-webkit-scrollbar-thumb:hover {
                        background: ${colors.accentPrimaryLight};
                    }
                `;
        document.head.appendChild(style);
        scrollbar.className = className;

        const scrollbarChild = scrollbar.firstChild as HTMLElement | null;
        if (scrollbarChild) {
            scrollbarChild.style.width = `${element.scrollWidth}px`;
            scrollbarChild.appendChild(document.createTextNode("\xA0"));
        }

        scrollbar.onscroll = function () {
            element.scrollLeft = scrollbar.scrollLeft;
        };
        element.onscroll = function () {
            scrollbar.scrollLeft = element.scrollLeft;
        };

        element.parentNode?.insertBefore(scrollbar, element);
        element.classList.add(className);
    };

    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    // Add the double scroll bar effect when the component mounts
    useEffect(() => {
        doubleScroll(tableContainerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableContainerRef, isLoading]);

    if (isLoading) {
        return (
            <Center>
                <CircularProgress />
            </Center>
        );
    }

    return tableData && category ? (
        <Container>
            <TableHeader>
                <Title variant="h6" gutterBottom>
                    {title}
                </Title>

                <StyledIconButton onClick={() => setIsNotesDialogOpen(true)} $color="#185698" padding="4px">
                    <CustomInfoIconCountry color="primary" className="info-button" />
                </StyledIconButton>
            </TableHeader>

            <TableLegend categoryId={categoryId} />

            <TableContainer
                component={TablePaper}
                id="doublescroll"
                style={{ overflowX: "auto" }}
                className={categoryId}
                ref={tableContainerRef}
            >
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

const TableHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0px;
    align-items: flex-start;
    width: 100%;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled(Typography)`
    font-family: Lato;
    margin-block-start: 10px;
    margin-block-end: 6px;
    font-size: 1rem;
    font-weight: bold;
    color: ${colors.black};
    white-space: "normal";
    width: 100%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-left: 15px;
    }
`;

const StyledIconButton = styled(IconButton)<{ $color: string; padding: string }>`
    padding: ${props => props.padding};
    color: ${props => props.$color};

    svg {
        font-size: 33px;
    }
`;

const CustomInfoIconCountry = styled(InfoIcon)`
    color: ${colors.darkBlue};
    font-size: 25px;
`;

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
    max-width: ${props => (props.type === PolicyExplorerCellType.HEADER ? "70px" : "15px")};
    min-width: ${props => (props.type === PolicyExplorerCellType.HEADER ? "70px" : "15px")};
    width: ${props => (props.type === PolicyExplorerCellType.HEADER ? "70px" : "15px")};
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
        tr:first-child > td {
            text-align: center;
            writing-mode: sideways-lr;
        }

        tr:first-child > td:first-child {
            text-align: left;
            writing-mode: unset;
        }

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
