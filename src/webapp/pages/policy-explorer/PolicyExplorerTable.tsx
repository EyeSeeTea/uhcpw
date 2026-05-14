import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import React, { RefObject, useCallback, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";
import SwitchIcon from "@material-ui/icons/Cached";
import { colors } from "../../pages/app/themes/dhis2.theme";

import i18n from "../../../locales";
import {
    PolicyExplorerCell,
    PolicyExplorerCellType,
    DataOrientation,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CategoryInfoDialog } from "../../components/dialog/CategoryInfoDialog";
import useWindowSize from "../../common/hooks/screen/useWindowSize";
import _ from "lodash";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
} from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { CategorySelectableOption } from "../../components/policy-explorer/category-selector/useCategorySelector";
import { PolicyExplorerTableValue } from "../../components/policy-explorer/PolicyExplorerTableValue";
import { TableLegend } from "../../components/policy-explorer/TableLegend";
import { BREAKPOINT_WIDTH_MOBILE_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { Maybe } from "../../../types/utils";

interface PolicyExplorerTableProps {
    category: CategorySelectableOption;
    rows?: PolicyExplorerCell[][];
    dataOrientation?: DataOrientation;
    onSwitchRowColumn: (categoryId: string) => void;
    referencesRef: RefObject<HTMLDivElement>;
    hasMoreThanOneCountry: boolean;
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
const MIN_DATA_CELL_WIDTH = 200;
const FIRST_COLUMN_SPECIAL_INVERTED_WIDTH = 180;
const CELL_HORIZONTAL_PADDING = 8; // 4px left + 4px right
const BORDER_SPACING = 3;

export const PolicyExplorerTable = React.memo(
    ({
        category,
        rows,
        onSwitchRowColumn,
        dataOrientation,
        referencesRef,
        hasMoreThanOneCountry,
    }: PolicyExplorerTableProps) => {
        const { width } = useWindowSize(true);

        const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

        const handleClose = useCallback(() => {
            setIsNotesDialogOpen(false);
        }, []);

        const isSpecialTable = React.useMemo(() => {
            return (
                category.value === DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY ||
                category.value === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY
            );
        }, [category.value]);

        const getCellWidth = React.useCallback(
            columnIndex => {
                // 128 is the padding of the screen
                const totalWidth = width - 128;

                const isSpecialInverted = isSpecialTable && dataOrientation === "inverted";
                if (isSpecialInverted) {
                    const totalColumns = rows?.[0]?.length || 1;
                    const totalPadding = totalColumns * CELL_HORIZONTAL_PADDING;
                    const totalBorderSpacing = (totalColumns + 1) * BORDER_SPACING;
                    const dataColumns = Math.max(totalColumns - 1, 1);
                    const availableWidth = Math.max(
                        totalWidth - FIRST_COLUMN_SPECIAL_INVERTED_WIDTH - totalPadding - totalBorderSpacing,
                        0
                    );
                    const dataColumnWidth = availableWidth / dataColumns;

                    return columnIndex === 0 ? FIRST_COLUMN_SPECIAL_INVERTED_WIDTH : dataColumnWidth;
                }

                if (isSpecialTable && dataOrientation === "normal") {
                    const totalColumns = rows?.[0]?.length || 1;
                    const totalPadding = totalColumns * CELL_HORIZONTAL_PADDING;
                    const totalBorderSpacing = (totalColumns + 1) * BORDER_SPACING;
                    const availableWidth = Math.max(totalWidth - totalPadding - totalBorderSpacing, 0);

                    return availableWidth / totalColumns;
                }

                if (dataOrientation === "inverted" && hasMoreThanOneCountry) {
                    const columnWidth = (totalWidth - MIN_DATA_CELL_WIDTH) / (rows?.[0]?.length || 1);
                    return columnIndex === 0
                        ? MIN_DATA_CELL_WIDTH
                        : columnWidth < MIN_DATA_CELL_WIDTH
                        ? MIN_DATA_CELL_WIDTH
                        : columnWidth;
                }
                const columnName = _.camelCase(rows?.[0]?.[columnIndex]?.value);

                if (
                    category.value === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES &&
                    columnName &&
                    columnName in CELLS_WIDTH_CATEGORY_BY_TYPE_OF_HEALTHCARE
                ) {
                    return CELLS_WIDTH_CATEGORY_BY_TYPE_OF_HEALTHCARE[
                        columnName as keyof typeof CELLS_WIDTH_CATEGORY_BY_TYPE_OF_HEALTHCARE
                    ];
                }
            },
            [category.value, dataOrientation, hasMoreThanOneCountry, isSpecialTable, rows, width]
        );

        // Function to create and synchronize the double scroll bar
        const doubleScroll = (element: HTMLDivElement | null) => {
            if (!element) return;
            const className = `custom-scrollbar-${category.value}`;

            const existingScrollbar = element.parentNode?.querySelector(`.${className}`);

            if (existingScrollbar) {
                existingScrollbar.remove();
            }

            const scrollbar = document.createElement("div");
            scrollbar.appendChild(document.createElement("div"));
            scrollbar.style.overflow = "auto";
            scrollbar.style.overflowY = "hidden";
            scrollbar.style.position = "relative";
            scrollbar.style.top = "13px"; // Maybe calculate this dynamically
            scrollbar.style.zIndex = "3";

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

        // Add the double scroll bar effect when the component mounts or layout changes
        useEffect(() => {
            doubleScroll(tableContainerRef.current);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [tableContainerRef, dataOrientation, width]);

        useEffect(() => {
            if (isSpecialTable && dataOrientation === "inverted") return;
            return stickyHeader(tableContainerRef.current);
        }, [rows, dataOrientation, isSpecialTable]);

        const isEmpty = useMemo(() => {
            return !rows?.length || (isSpecialTable && rows.every(row => row.length === 1));
        }, [rows, isSpecialTable]);

        return isEmpty || !dataOrientation ? (
            category && (
                <NoDataContainer>
                    <Wrapper>
                        <Typography variant="h6" color="primary">
                            {category.text}
                        </Typography>
                        <InfoButton onClick={() => setIsNotesDialogOpen(true)}>
                            <InfoIcon color="primary" />
                        </InfoButton>
                    </Wrapper>
                    <Container>
                        <Content>
                            <Title variant="h6">{i18n.t("Country information coming soon")}</Title>
                        </Content>
                    </Container>
                    <CategoryInfoDialog isOpen={isNotesDialogOpen} onClose={handleClose} category={category} />
                </NoDataContainer>
            )
        ) : (
            <>
                <TableHeader>
                    <TitleButtonRow>
                        {category && (
                            <Row>
                                <Typography variant="h6" color="primary">
                                    {category.text}
                                </Typography>

                                <InfoButton onClick={() => setIsNotesDialogOpen(true)}>
                                    <InfoIcon color="primary" />
                                </InfoButton>
                            </Row>
                        )}

                        <Row>
                            <SwitchRowColumnButton
                                aria-label="Row/Column"
                                variant="contained"
                                endIcon={<SwitchIcon />}
                                color="primary"
                                onClick={() => onSwitchRowColumn(category.value)}
                                className="switch-button"
                            >
                                <Typography>{i18n.t("Row/Column")}</Typography>
                            </SwitchRowColumnButton>
                        </Row>
                    </TitleButtonRow>
                </TableHeader>

                <TableLegend categoryId={category.value} />

                <TableContainer
                    component={TablePaper}
                    ref={tableContainerRef}
                    id="doublescroll"
                    style={{ overflowX: "auto" }}
                    className={category.value}
                >
                    <StyledTable orientation={dataOrientation} fullWidth>
                        <StyledTableBody $orientation={dataOrientation} className={category.value + "-table"}>
                            {rows?.map((row, index) => (
                                <TableRow key={`${category.value}_${index}_${row.toString()}`}>
                                    {row.map((cell, i) => (
                                        <StyledTableCell
                                            key={`${category.value}_${i}_${cell.value}`}
                                            type={cell.type}
                                            cellwidth={getCellWidth(i)}
                                        >
                                            <PolicyExplorerTableValue cell={cell} referencesRef={referencesRef} />
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </StyledTableBody>
                    </StyledTable>
                </TableContainer>

                <CategoryInfoDialog isOpen={isNotesDialogOpen} onClose={handleClose} category={category} />
            </>
        );
    }
);

// use js approach on sticky header instead of css because overflow-x conflicts with position: sticky;
// we need to support horizontal scroll because the tables can have a lot of columns
function stickyHeader(container: HTMLDivElement | null): Maybe<() => void> {
    if (!container) return;

    const handleScroll = () => {
        const table = container.querySelector("table");
        const headerRow = table?.querySelector("tbody > tr:first-child");
        if (!table || !headerRow) return;

        const headerCells = headerRow.querySelectorAll<HTMLElement>("td");
        const tableRect = table.getBoundingClientRect();
        const headerHeight = headerRow.getBoundingClientRect().height;
        const topScrollbar = container.previousElementSibling as HTMLElement | null;
        const topScrollbarHeight = topScrollbar?.getBoundingClientRect().height ?? 0;

        if (tableRect.top < 0 && tableRect.bottom > 0) {
            const headerOffset = Math.min(-tableRect.top, tableRect.height - headerHeight);
            headerCells.forEach(cell => {
                cell.style.transform = `translateY(${headerOffset}px)`;
                cell.style.willChange = "transform";
                cell.style.zIndex = "2";
            });

            if (topScrollbar) {
                const containerRect = container.getBoundingClientRect();
                const scrollbarOffset = Math.min(-containerRect.top, containerRect.height - topScrollbarHeight);
                topScrollbar.style.transform = `translateY(${scrollbarOffset}px)`;
                topScrollbar.style.willChange = "transform";
            }
        } else {
            headerCells.forEach(cell => {
                cell.style.transform = "";
                cell.style.willChange = "";
                cell.style.zIndex = "";
            });
            if (topScrollbar) {
                topScrollbar.style.transform = "";
                topScrollbar.style.willChange = "";
            }
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
}

export const StyledTable: React.FC<{
    orientation: DataOrientation;
    fullWidth?: boolean;
}> = ({ orientation, children, fullWidth = true }) => {
    return orientation === "normal" ? (
        <StyledNormalTable aria-label="simple table" fullWidth={fullWidth}>
            {children}
        </StyledNormalTable>
    ) : (
        <StyledInvertedTable aria-label="simple table" fullWidth={fullWidth}>
            {children}
        </StyledInvertedTable>
    );
};

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const TitleButtonRow = styled(Row)`
    @media (max-width: ${BREAKPOINT_WIDTH_MOBILE_SCREEN}px) {
        flex-direction: column;
        margin-block-start: 16px;
    }
`;

const TableHeader = styled.div`
    padding-block-start: 10px;
    padding-block-end: 12px;
`;

const TablePaper = styled(Paper)`
    border-radius: 10px;
    box-shadow: none;
    margin-block-end: 36px;
    &:last-child {
        margin-block-end: 26px;
    }
`;

const StyledNormalTable = styled(Table)<{ fullWidth?: boolean }>`
    width: ${props => (props.fullWidth ? "100%" : "fit-content")};
    table-layout: ${props => (props.fullWidth ? "auto" : "fixed")};
    border-spacing: 3px;
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
    padding-block: 8px;
    > p {
        margin: 0px;
    }
`;

const StyledInvertedTable = styled(Table)<{ fullWidth?: boolean }>`
    width: ${props => (props.fullWidth ? "100%" : "fit-content")};
    table-layout: ${props => (props.fullWidth ? "auto" : "fixed")};
    border-spacing: 3px;
    border-collapse: initial;

    tbody > tr > td {
        vertical-align: top;
    }
`;

const NoDataContainer = styled.div`
    padding-block: 10px 0px;
    padding-inline: 0px;
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled.div`
    display: flex;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-block-start: 36px;
    margin-block-end: 36px;
`;

const Content = styled.div`
    border-radius: 10px;
    background: #cce8f7;
    max-width: 550px;
    padding: 24px 16px;
    MuiSvgIcon-fontSizeLarge {
        font-size: 10rem;
    }
`;

const Title = styled(Typography)`
    color: #008ad7;
`;

const InfoButton = styled(Button)`
    align-self: baseline;
`;

const SwitchRowColumnButton = styled(Button)`
    border-radius: 20px;
    padding: 0px 32px;
    height: 42px;
    width: 170px;
    text-transform: initial;
    background: #185698;

    @media (max-width: ${BREAKPOINT_WIDTH_MOBILE_SCREEN}px) {
        height: 50px;
        width: 100%;
        margin-block-start: 20px;
        justify-content: center;
        padding: 6px 16px;
    }
`;

const StyledTableBody = styled(TableBody)<{ $orientation: DataOrientation }>`
    tr:first-child > td {
        background-color: #d3e5f5;
        color: #0460a7;

        .MuiTableCell-root {
            border: none;
        }
    }

    &.u800TAhsIBY_Cat-table,
    &.Nx6S3aQkvWe-table {
        tr:first-child {
            text-align-last: left;
        }
        tr:not(:first-child) {
            td {
                padding-block: 3px;
                p {
                    margin-block: 0px;
                }
            }
        }

        tr:first-child > td {
            text-align: ${props => (props.$orientation === "inverted" ? "left" : "center")};
            text-align-last: ${props => (props.$orientation === "inverted" ? "left" : "center")};
            writing-mode: ${props => (props.$orientation === "inverted" ? "sideways-lr" : "unset")};
            width: ${props => (props.$orientation === "inverted" ? "auto" : "100px")};
            min-width: ${props => (props.$orientation === "inverted" ? "0" : "100px")};
            max-height: ${props => (props.$orientation === "inverted" ? "90px" : "fit-content")};
            height: ${props => (props.$orientation === "inverted" ? "90px" : "fit-content")};

            &:first-child {
                width: ${props => (props.$orientation === "inverted" ? "180px" : "90px")};
                min-width: ${props => (props.$orientation === "inverted" ? "180px" : "90px")};
            }
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
            width: ${props => (props.$orientation === "inverted" ? "180px" : "90px")};
            min-width: ${props => (props.$orientation === "inverted" ? "180px" : "90px")};
            white-space: ${props => (props.$orientation === "inverted" ? "normal" : "nowrap")};
        }

        td {
            text-align: center;
            vertical-align: middle;
            padding: 4px;
            > p {
                margin: 0;

                &:first-child {
                    margin: 8px 4px;
                }
            }
        }
    }
`;
