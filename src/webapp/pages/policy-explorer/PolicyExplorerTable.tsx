import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import React, { RefObject, useCallback, useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import InfoIcon from "@material-ui/icons/Info";
import SwitchIcon from "@material-ui/icons/Cached";
import ReactMarkdown from "react-markdown";
import { CategoryOption } from "../../components/policy-explorer/category-selector/CategorySelector";
import {
    PolicyExplorerCell,
    PolicyExplorerCellType,
    DataOrientation,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CategoryInfoDialog } from "../../components/dialog/CategoryInfoDialog";

interface PolicyExplorerTableProps {
    category: CategoryOption;
    rows?: PolicyExplorerCell[][];
    dataOrientation?: DataOrientation;
    onSwitchRowColumn: (categoryId: string) => void;
    referencesRef: RefObject<HTMLDivElement>;
}

const EMPTY_URL = "/";

export const PolicyExplorerTable = React.memo(
    ({ category, rows, onSwitchRowColumn, dataOrientation, referencesRef }: PolicyExplorerTableProps) => {
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
        return !rows?.length || !dataOrientation ? (
            category && (
                <NoDataContainer>
                    <Wrapper>
                        <Typography variant="h6" color="primary">
                            {category.text}
                        </Typography>
                        <Button onClick={() => setIsNotesDialogOpen(true)}>
                            <InfoIcon color="primary" />
                        </Button>
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
                                <Typography variant="h6" color="primary">
                                    {category.text}
                                </Typography>
                                <Button onClick={() => setIsNotesDialogOpen(true)}>
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

const NoDataContainer = styled.div`
    padding: 48px 0px;
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
    margin-top: 50px;
    margin-bottom: 50px;
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
