import {
    Box,
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
import DownloadIcon from "@material-ui/icons/CloudDownload";

import { PolicyExplorerCellType } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerTableValue } from "../../components/policy-explorer/PolicyExplorerTableValue";
import { TableLegend } from "../../components/policy-explorer/TableLegend";
import { Id } from "../../../domain/entities/Ref";
import { useRegionalPolicyExplorerTable } from "./useRegionalPolicyExplorerTable";
import { colors } from "../app/themes/dhis2.theme";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { NotesDialog } from "../../components/dialog/NotesDialog";

interface PolicyExplorerTableProps {
    title: string;
    countries: Id[];
    categoryId: string;
    years: string[];
}

export const PolicyExplorerTable: React.FC<PolicyExplorerTableProps> = React.memo(props => {
    const { title, countries, categoryId, years } = props;
    const { tableData, hasData, category, isNotesDialogOpen, setIsNotesDialogOpen, isLoading, onDownload } =
        useRegionalPolicyExplorerTable(countries, categoryId, years);

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
        scrollbar.style.top = "7px";
        scrollbar.style.height = "13px";

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

    return tableData && hasData && category ? (
        <Container>
            <TableHeader>
                <Title variant="h6" gutterBottom>
                    {title}
                </Title>
                <Box display="flex" gridGap={6}>
                    <StyledIconButton onClick={() => setIsNotesDialogOpen(true)} $color="#185698" padding="4px">
                        <CustomInfoIconCountry color="primary" className="info-button" />
                    </StyledIconButton>
                    <ImageContainer>
                        <IconButton component="a" onClick={onDownload} download color="primary">
                            <CustomImageIcon color="primary" className="download-button" />
                        </IconButton>
                    </ImageContainer>
                </Box>
            </TableHeader>

            <LegendContainer>
                <TableLegend categoryId={categoryId} />
            </LegendContainer>

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

            <NotesDialog
                isOpen={isNotesDialogOpen}
                onClose={() => setIsNotesDialogOpen(false)}
                dialogInfo={category.description}
            />
        </Container>
    ) : null;
});

const LegendContainer = styled.div`
    width: 100%;
    font-size: 14px;

    > div {
        margin-block: 0;
        width: 100%;
        justify-content: flex-start;
        gap: 3%;
    }
`;

const TableHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0px;
    align-items: flex-start;
    width: 100%;
    gap: 24px;
    justify-content: space-between;
    margin-block-start: 20px;
`;

const Title = styled(Typography)`
    font-family: Lato;
    margin-block-end: 5px;
    font-size: 1rem;
    font-weight: bold;
    color: ${colors.black};
    white-space: "normal";
    width: 100%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-left: 0;
    }
`;

const StyledIconButton = styled(IconButton)<{ $color: string; padding: string }>`
    padding: ${props => props.padding};
    color: ${props => props.$color};
    padding-block-start: 0;

    svg {
        font-size: 33px;
    }
`;

const CustomInfoIconCountry = styled(InfoIcon)`
    color: #185698;
    margin-top: -3px;
`;

const CustomImageIcon = styled(DownloadIcon)`
    color: white;
    background-color: #185698;
    border-radius: 50%;
    padding: 4px;
    font-size: 20px;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: fit-content;

    a {
        align-self: flex-end;
        padding: 0;
    }
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
    max-width: ${props => (props.type === PolicyExplorerCellType.HEADER ? "150px" : "18px")};
    min-width: ${props => (props.type === PolicyExplorerCellType.HEADER ? "150px" : "18px")};
    width: ${props => (props.type === PolicyExplorerCellType.HEADER ? "150px" : "18px")};
    color: black;
    margin: 0;
    padding: 0;

    > p {
        margin: 0;

        &:first-child {
            margin: 8px 4px;
        }
    }
`;

const StyledTable = styled(Table)`
    width: 100%;
    table-layout: fixed;
    border-spacing: 2px 2px;
    border-collapse: separate;
    background-color: white;

    tbody > tr > td {
        vertical-align: top;
    }
`;

const StyledTableBody = styled(TableBody)`
    &.u800TAhsIBY_Cat-table,
    &.Nx6S3aQkvWe-table {
        tr:first-child {
            text-align-last: left;
        }

        tr:first-child > td {
            text-align: center;
            writing-mode: sideways-lr;
        }

        tr:first-child > td:first-child {
            text-align: left;
            writing-mode: unset;
            visibility: hidden;
        }

        tr:first-child > td > p {
            margin: 4px;
        }

        tr > td:first-child {
            text-align: left;
        }

        td {
            text-align: center;
            vertical-align: middle;
        }
    }

    &.Nx6S3aQkvWe-table {
        tr:first-child {
            background-color: white;
        }

        tr:nth-child(2n) {
            background-color: #e5f5ff;
        }

        tr:nth-child(2n + 1):not(:first-child) {
            background-color: #f7fcff;
        }
    }

    &.u800TAhsIBY_Cat-table {
        tr:first-child td {
            background-color: white;
        }

        tr:not(:first-child) td:nth-child(odd) {
            background-color: #f7fcff;
        }

        tr:not(:first-child) td:nth-child(even) {
            background-color: #e5f5ff;
        }
    }
`;

const Container = styled.div`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: calc(100% - 64px);
        max-width: calc(100% - 64px);
    }
`;

const Center = styled.div`
    height: 350px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
