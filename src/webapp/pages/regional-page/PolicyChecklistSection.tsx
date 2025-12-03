import React from "react";
import styled from "styled-components";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Typography,
    CircularProgress,
    Button,
} from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";
import DownloadIcon from "@material-ui/icons/CloudDownload";

import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import i18n from "../../../locales";
import { Maybe } from "../../../types/utils";
import { Id } from "../../../domain/entities/Ref";
import { colors } from "../app/themes/dhis2.theme";
import { ChecklistPolicyMakersWithCountries, CountryExperienceData } from "./useRegionalPolicyChecklist";
import { CountryExperienceBox } from "./CountryExperienceBox";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { CheckCircleCustomtIcon } from "../../components/icons/CheckCircleCustomtIcon";

type PolicyChecklistSectionProps = {
    textSectionLeft: string;
    textSectionRight: string;
    checklist: Maybe<ChecklistPolicyMakersWithCountries[]>;
    filteredCountryExperiences: Maybe<CountryExperienceData[]>;
    selectedChecklistItem: Id | undefined;
    onSelectChecklistItem: (id: Id) => void;
    isLoading: boolean;
    isSmallScreen: boolean;
    hasDownloadFile?: boolean;
    downloadFile: string;
    onSetSidePanelWidth?: (width: number) => void;
};

export const PolicyChecklistSection: React.FC<PolicyChecklistSectionProps> = React.memo(props => {
    const {
        textSectionLeft,
        textSectionRight,
        checklist,
        filteredCountryExperiences,
        selectedChecklistItem,
        onSelectChecklistItem,
        isLoading,
        isSmallScreen,
        downloadFile,
        hasDownloadFile = false,
        onSetSidePanelWidth,
    } = props;
    const { redirectWithExternalLink } = useAnalytics();
    const firstPanelRef = React.useRef<HTMLDivElement | null>(null);

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Paragraph variant="body1" gutterBottom>
                    {children}
                </Paragraph>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
            a: ({ ...props }) => (
                <TextLink href={props.href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
                    {props.children}
                </TextLink>
            ),
        }),
        [redirectWithExternalLink]
    );

    React.useEffect(() => {
        if (!onSetSidePanelWidth || !firstPanelRef.current || isLoading) return;

        const element = firstPanelRef.current;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                onSetSidePanelWidth(width + 64); // adding the left padding of the container
            }
        });

        observer.observe(element);

        onSetSidePanelWidth(element.offsetWidth + 64); // adding the left padding of the container

        return () => {
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSetSidePanelWidth, isLoading, firstPanelRef.current]);

    return (
        <Container>
            {isLoading || !checklist ? (
                <CircularProgress />
            ) : (
                <>
                    {isSmallScreen && (
                        <TextContentWrapper ref={firstPanelRef}>
                            <IntroText>
                                <ReactMarkdown components={markdownComponents}>{textSectionLeft}</ReactMarkdown>

                                <ReactMarkdown components={markdownComponents}>{textSectionRight}</ReactMarkdown>
                            </IntroText>
                        </TextContentWrapper>
                    )}

                    <ContentWrapper>
                        {!isSmallScreen && (
                            <TextContentWrapper ref={firstPanelRef}>
                                <IntroText>
                                    <ReactMarkdown components={markdownComponents}>{textSectionLeft}</ReactMarkdown>

                                    <ReactMarkdown components={markdownComponents}>{textSectionRight}</ReactMarkdown>
                                </IntroText>
                            </TextContentWrapper>
                        )}

                        <div>
                            <TableTitleContainer>
                                <Title variant="body1">
                                    {i18n.t("Click an item on the policy checklist to see country examples")}
                                </Title>

                                {hasDownloadFile && (
                                    <a
                                        href={downloadFile}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={redirectWithExternalLink}
                                    >
                                        {isSmallScreen ? (
                                            <DownloadIconButton>
                                                <CustomCloudIcon color="primary" className="download-button" />
                                            </DownloadIconButton>
                                        ) : (
                                            <DownloadButton
                                                variant="contained"
                                                endIcon={<DownloadIcon />}
                                                color="primary"
                                                className="download-button"
                                            >
                                                <Typography>{i18n.t("Download")}</Typography>
                                            </DownloadButton>
                                        )}
                                    </a>
                                )}
                            </TableTitleContainer>

                            <TableContainer>
                                <StyledTable>
                                    <TableBody>
                                        {checklist.map(item => (
                                            <StyledTableRow
                                                key={item.id}
                                                onClick={() =>
                                                    item.countryExperiencesIds.length !== 0 &&
                                                    onSelectChecklistItem(item.id)
                                                }
                                                $isSelectable={item.countryExperiencesIds.length !== 0}
                                            >
                                                <StyledTableCell $isSelected={selectedChecklistItem === item.id}>
                                                    <ReactMarkdown components={markdownComponents}>
                                                        {item.text}
                                                    </ReactMarkdown>
                                                </StyledTableCell>

                                                <StyledTableCell
                                                    align="right"
                                                    $isSelected={selectedChecklistItem === item.id}
                                                >
                                                    {item.countryExperiencesIds.length === 0 ? null : (
                                                        <StyledIconButton
                                                            onClick={() => onSelectChecklistItem(item.id)}
                                                        >
                                                            <CheckCircleCustomtIcon
                                                                height="28px"
                                                                width="28px"
                                                                circleColor={
                                                                    selectedChecklistItem === item.id
                                                                        ? colors.white
                                                                        : colors.accentPrimary
                                                                }
                                                                tickColor={
                                                                    selectedChecklistItem === item.id
                                                                        ? colors.accentPrimary
                                                                        : colors.white
                                                                }
                                                            />
                                                        </StyledIconButton>
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </StyledTable>
                            </TableContainer>
                        </div>

                        <StickyRightColumn>
                            <CountryExperiencesContainer>
                                {filteredCountryExperiences && filteredCountryExperiences.length > 0
                                    ? filteredCountryExperiences.map(countryExperience => (
                                          <CountryExperienceBox
                                              key={`${selectedChecklistItem || ""}-${countryExperience.countryId}`}
                                              countryName={countryExperience.countryName}
                                              title={countryExperience.title}
                                              content={countryExperience.content}
                                              reference={countryExperience.reference}
                                              showDialogInFullScreen={isSmallScreen}
                                              disableGoToCountryPage={countryExperience.disableGoToCountryPage}
                                          />
                                      ))
                                    : null}
                            </CountryExperiencesContainer>
                        </StickyRightColumn>
                    </ContentWrapper>
                </>
            )}
        </Container>
    );
});

const Container = styled.div`
    padding: 40px 64px 40px 64px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-end: 0;
        padding: 32px;
    }
`;

const StyledTableRow = styled(TableRow)<{ $isSelectable?: boolean }>`
    cursor: ${props => (props.$isSelectable ? "pointer" : "default")};
`;

const StyledIconButton = styled(IconButton)`
    padding: 0;
`;

const Title = styled(Typography)`
    font-family: Lato;
    color: ${colors.blue};
    font-size: 16px;

    &&& {
        font-weight: bold;
    }
`;

const IntroText = styled.div`
    width: 100%;
`;

const TextContentWrapper = styled.div`
    display: block;
    margin-block-end: 24px;
`;

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 33%) minmax(0, 33%) minmax(0, 33%);
    gap: 50px;
    width: 100%;
    > * {
        min-height: 0;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        grid-template-columns: minmax(0, 50%) minmax(0, 50%);
    }
`;

const StickyRightColumn = styled.div`
    position: sticky;
    top: 0;
    align-self: flex-start;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        top: 45px;
    }
`;

const TableContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-direction: column;
    min-height: 0;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 100%;
    }
`;

const CountryExperiencesContainer = styled.div`
    background-color: ${colors.white};
    width: 100%;
    overflow-y: auto;
    flex: 1 1 auto;
    margin-block-start: 70px;
    max-height: calc(100vh - 70px - 80px);

    div:last-child {
        margin-block-end: 0;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        overflow: visible;
        max-height: none;
        height: auto;
    }
`;

const StyledTable = styled(Table)`
    border-spacing: 0.8px;
    border-collapse: initial;
    tbody > tr:first-child > td {
        vertical-align: top;
    }
    tbody > tr > td {
        vertical-align: top;
    }
`;

const StyledTableCell = styled(TableCell)<{ $isSelected?: boolean }>`
    color: ${colors.blue};
    font-weight: 500;
    background-color: ${props => (props.$isSelected ? colors.blue50 : colors.blue10)};
    color: black;
    align-content: "start";
    border-width: 4px;
    padding: 12px;
`;

const TableTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 70px;
    gap: 10px;
`;

const DownloadButton = styled(Button)`
    border-radius: 20px;
    height: 42px;
    background: #185698;
    text-transform: initial;
`;

const Paragraph = styled(Typography)`
    font-family: Lato;
    margin-block: 10px;
    font-size: 16px;
    color: ${colors.black};

    &:first-child {
        margin-block-start: 0;
    }

    &:last-child {
        margin-block-end: 0;
    }
`;

const StyledLi = styled.li`
    line-height: 1.43;
    font-size: 16px;
    color: ${colors.black};
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
    font-size: 16px;
    color: ${colors.black};
    margin-block: 0;
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const DownloadIconButton = styled(IconButton)`
    padding: 0;
    color: white;
`;

const CustomCloudIcon = styled(DownloadIcon)`
    color: white;
    background-color: #185698;
    border-radius: 50%;
    padding: 4px;
    font-size: 20px;
`;
