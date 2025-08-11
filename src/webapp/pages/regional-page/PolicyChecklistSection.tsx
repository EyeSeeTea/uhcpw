import React, { useState } from "react";
import styled from "styled-components";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Typography,
    Button,
    CircularProgress,
} from "@material-ui/core";
import { CheckCircleOutline, CheckCircle, CloudDownload } from "@material-ui/icons";
import ReactMarkdown, { Components } from "react-markdown";

import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import i18n from "../../../locales";
import { ChecklistPolicyMakersState } from "./useRegionalPageInfo";
import { Maybe } from "../../../types/utils";

type PolicyChecklistSectionProps = {
    checklist: Maybe<ChecklistPolicyMakersState["checklist"]>;
    progressInfo: Maybe<string>;
    onDownload: (checklist: string[], selections: boolean[]) => void;
};

export const PolicyChecklistSection: React.FC<PolicyChecklistSectionProps> = React.memo(props => {
    const { checklist, progressInfo, onDownload } = props;
    const [selection, setSelection] = useState<boolean[]>(Array(checklist?.length).fill(false));

    const handleClick = React.useCallback(
        (index: number) => {
            const updated = [...selection];
            updated[index] = !updated[index];
            setSelection(updated);
        },
        [selection]
    );

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Text variant="body1" gutterBottom>
                    {children}
                </Text>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
        }),
        []
    );

    return (
        <Container>
            <StyledTypography variant="h5">
                {i18n.t(
                    "Drawing on evidence and examples of good practice from across Europe, the checklist highlights the"
                )}{" "}
                <strong>{i18n.t("policy choices that have improved financial protection")}</strong>{" "}
                {i18n.t("in countries with a low incidence of financial hardship and unmet need.")}
            </StyledTypography>

            <Content>
                {checklist && progressInfo ? (
                    <>
                        <TableContainer>
                            <DownloadButton
                                aria-label="Download"
                                variant="contained"
                                endIcon={<CloudDownload />}
                                color="primary"
                                onClick={() => onDownload(checklist, selection)}
                                className="download-button"
                            >
                                <Typography>{i18n.t("Download")}</Typography>
                            </DownloadButton>

                            <StyledTable>
                                <TableBody>
                                    {checklist.map((item, index) => (
                                        <TableRow key={index}>
                                            <StyledTableCell>
                                                <ReactMarkdown components={markdownComponents}>{item}</ReactMarkdown>
                                            </StyledTableCell>

                                            <StyledTableCell align="right">
                                                <IconButton onClick={() => handleClick(index)}>
                                                    {selection[index] ? (
                                                        <CheckCircle color="primary" />
                                                    ) : (
                                                        <CheckCircleOutline />
                                                    )}
                                                </IconButton>
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                        </TableContainer>

                        <TextBoxContainer>
                            {progressInfo && (
                                <TextBox>
                                    <Typography
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {i18n.t("Progress is possible")}
                                    </Typography>

                                    <ReactMarkdown components={markdownComponents}>{progressInfo}</ReactMarkdown>
                                </TextBox>
                            )}
                        </TextBoxContainer>
                    </>
                ) : (
                    <CircularProgress />
                )}
            </Content>
        </Container>
    );
});

const Container = styled.div`
    padding: 40px 20px 40px 60px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline-start: 30px;
        margin-block-end: 0;
    }
`;

const StyledTypography = styled(Typography)``;

const Content = styled.div`
    display: flex;
    gap: 60px;
    align-items: flex-start;
    margin-block-start: 16px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        flex-direction: column;
    }
`;

const TableContainer = styled.div`
    flex: 1 1 70%;
    display: flex;
    gap: 16px;
    flex-direction: column;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 100%;
    }
`;

const TextBoxContainer = styled.div`
    flex: 1 1 30%;
    background-color: white;
    align-self: center;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 100%;
    }
`;

const StyledTable = styled(Table)`
    border-spacing: 0.8px;
    border-collapse: initial;
    tbody > tr:first-child > td {
        vertical-align: middle;
    }
    tbody > tr > td {
        vertical-align: top;
    }
`;

const StyledTableCell = styled(TableCell)`
    color: #0460a7;
    font-weight: 500;
    background-color: #f4f8fc;
    color: black;
`;

const TextBox = styled.div`
    padding: 20px;
    border: 1px solid #96dcf8;
`;

const Text = styled(Typography)`
    font-family: Lato;
`;

const StyledLi = styled.li`
    line-height: 1.43;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
`;

const DownloadButton = styled(Button)`
    border-radius: 20px;
    padding: 0px 32px;
    height: 42px;
    width: 170px;
    text-transform: initial;
    align-self: flex-end;
    background: #185698;
`;
