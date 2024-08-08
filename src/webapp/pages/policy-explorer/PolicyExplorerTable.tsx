import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import React, { RefObject, useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";
import SwitchIcon from "@material-ui/icons/Cached";
import ReactMarkdown from "react-markdown";

import i18n from "../../../locales";
import { CategoryOption } from "../../components/policy-explorer/category-selector/CategorySelector";
import {
    PolicyExplorerCell,
    PolicyExplorerCellType,
    DataOrientation,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CategoryInfoDialog } from "../../components/dialog/CategoryInfoDialog";
import useWindowSize from "../../common/hooks/screen/useWindowSize";
import { CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID } from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";

interface PolicyExplorerTableProps {
    category: CategoryOption;
    rows?: PolicyExplorerCell[][];
    dataOrientation?: DataOrientation;
    onSwitchRowColumn: (categoryId: string) => void;
    referencesRef: RefObject<HTMLDivElement>;
}

const EMPTY_URL = "/";
const MIN_CELL_WIDTH = 200;

export const PolicyExplorerTable = React.memo(
    ({ category, rows, onSwitchRowColumn, dataOrientation, referencesRef }: PolicyExplorerTableProps) => {
        const { width } = useWindowSize();

        const handleClickEmptyUrl = useCallback(
            event => {
                event.preventDefault();
                referencesRef.current?.scrollIntoView({ behavior: "smooth" });
            },
            [referencesRef]
        );

        const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

        const handleClose = useCallback(() => {
            setIsNotesDialogOpen(false);
        }, []);

        const getCellWidth = React.useCallback(
            columnIndex => {
                // 128 is the padding of the screen
                const totalWidth = width - 128;

                if (dataOrientation === "normal" && rows?.[0]?.[columnIndex]) {
                    const columnWidth =
                        rows?.[0]?.[columnIndex]?.value === "Year" ||
                        rows?.[0]?.[columnIndex]?.value === "Country" ||
                        (category.value === CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID &&
                            rows?.[0]?.[columnIndex]?.value === "")
                            ? MIN_CELL_WIDTH
                            : category.value === CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID
                            ? (totalWidth - 300) / (rows?.[0]?.length || 1)
                            : (totalWidth - 200) / (rows?.[0]?.length || 1);

                    return columnWidth < MIN_CELL_WIDTH ? MIN_CELL_WIDTH : columnWidth;
                }

                const columnWidth = (totalWidth - MIN_CELL_WIDTH) / (rows?.[0]?.length || 1);
                return columnIndex === 0 ? MIN_CELL_WIDTH : columnWidth < MIN_CELL_WIDTH ? MIN_CELL_WIDTH : columnWidth;
            },
            [category.value, dataOrientation, rows, width]
        );

        // Function to create and synchronize the double scroll bar
        const doubleScroll = (element: HTMLDivElement | null) => {
            if (!element) return;

            const scrollbar = document.createElement("div");
            scrollbar.appendChild(document.createElement("div"));
            scrollbar.style.overflow = "auto";
            scrollbar.style.overflowY = "hidden";
            scrollbar.style.position = "relative";
            scrollbar.style.top = "15px"; // Maybe calculate this dynamically

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
        };

        // Ref for the table container
        const tableContainerRef = React.useRef<HTMLDivElement>(null);
        // Add the double scroll bar effect when the component mounts
        useEffect(() => {
            doubleScroll(tableContainerRef.current);
        }, [tableContainerRef]);

        return !rows?.length || !dataOrientation ? (
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
                    <Row>
                        {category && (
                            <Row>
                                {/* padding */}
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
                    </Row>
                </TableHeader>
                <TableContainer
                    component={TablePaper}
                    ref={tableContainerRef}
                    id="doublescroll"
                    style={{ overflowX: "auto" }}
                >
                    <StyledTable orientation={dataOrientation}>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={`${category.value}_${index}_${row.toString()}`}>
                                    {row.map((cell, i) => (
                                        <StyledTableCell
                                            key={`${category.value}_${i}_${cell.value}`}
                                            type={cell.type}
                                            cellwidth={getCellWidth(i)}
                                        >
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ href, children, ...props }) => {
                                                        return href === EMPTY_URL ? (
                                                            <a href={href} {...props} onClick={handleClickEmptyUrl}>
                                                                {children}
                                                            </a>
                                                        ) : (
                                                            <a href={href} {...props}>
                                                                {children}
                                                            </a>
                                                        );
                                                    },
                                                    li: ({ children, ...props }) => (
                                                        <StyledLi {...props}>{children} </StyledLi>
                                                    ),
                                                    ul: ({ children, ...props }) => (
                                                        <StyledUl {...props}>{children}</StyledUl>
                                                    ),
                                                }}
                                            >
                                                {cell.references ? `${cell.value}\n\n${cell.references}` : cell.value}
                                            </ReactMarkdown>
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                </TableContainer>
                <CategoryInfoDialog isOpen={isNotesDialogOpen} onClose={handleClose} category={category} />
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

const StyledTableCell = styled(TableCell)<{ type: PolicyExplorerCellType; cellwidth: number }>`
    color: #0460a7;
    font-weight: 500;
    width: ${props => `${props.cellwidth}px`};
    min-width: ${props => `${props.cellwidth}px`};
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

const StyledLi = styled.li`
    line-height: 1.43;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
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
`;
