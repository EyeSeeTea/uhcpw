import { Button, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../app/themes/dhis2.theme";
import { Layout } from "../../components/layout/Layout";
import bubblePattern from "../../assets/bubble-pattern-white.png";
import i18n from "../../../locales";
import { useMethods } from "./useMethods";
import BookIcon from "@material-ui/icons/BookOutlined";
import ReactMarkdown from "react-markdown";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { useState } from "react";
import { Glossary } from "../../components/layout/app-header/Glossary";

const MethodsMarkdown = ({ children }: { children: string }) => {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => <Typography variant="body2">{children}</Typography>,
                li: ({ children }) => (
                    <li>
                        <Typography variant="body2">{children}</Typography>
                    </li>
                ),
            }}
        >
            {children}
        </ReactMarkdown>
    );
};

export const MethodsPage: React.FC = () => {
    const { methods, isExpanded, setExpanded } = useMethods();

    const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

    const handleClick = (index: number) => {
        const updatedExpanded = [...isExpanded];
        updatedExpanded[index] = !updatedExpanded[index];
        setExpanded(updatedExpanded);
    };

    return (
        <Layout>
            <TitleContainer aria-label="methods-page-header">
                <Typography variant="h3">{i18n.t("Methods")}</Typography>
            </TitleContainer>
            <StyledGrid container spacing={2} aria-label="methods-container">
                {methods.map((method, i) => (
                    <Grid item xs={6} key={method.sectionName} aria-label="method-item">
                        <Typography variant="h5" style={{ marginBottom: "10px" }}>
                            {method.sectionName}
                        </Typography>
                        {isExpanded[i] === false ? (
                            <>
                                <MethodsMarkdown>{method.shortText}</MethodsMarkdown>
                                <StyledReadMoreButton endIcon={<ExpandMoreIcon />} onClick={() => handleClick(i)}>
                                    {i18n.t("Read more")}
                                </StyledReadMoreButton>
                            </>
                        ) : (
                            <>
                                <MethodsMarkdown>{method.text}</MethodsMarkdown>
                                <StyledReadMoreButton endIcon={<ExpandLessIcon />} onClick={() => handleClick(i)}>
                                    {i18n.t("Read less")}
                                </StyledReadMoreButton>
                            </>
                        )}
                    </Grid>
                ))}
            </StyledGrid>
            <ButtonsContainer aria-label="methods-buttons">
                <StyledButton startIcon={<BookIcon />} onClick={() => setIsGlossaryOpen(!isGlossaryOpen)}>
                    {i18n.t("Glossary")}
                </StyledButton>
                <StyledButton startIcon={<BookIcon />}>{i18n.t("Country abbreviations")}</StyledButton>
            </ButtonsContainer>
            <Glossary isOpen={isGlossaryOpen} setIsOpen={setIsGlossaryOpen} />
        </Layout>
    );
};

const TitleContainer = styled.div`
    background: url(${bubblePattern}) no-repeat right top;
    background-color: ${colors.accentPrimary};
    color: white;
    padding: 48px 200px 48px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const StyledGrid = styled(Grid)`
    padding: 40px;
`;

const StyledButton = styled(Button)`
    border-radius: 20px;
    color: white;
    background-color: ${colors.accentPrimary};
    text-transform: none;
    padding: 5px 10px;
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 20px;
    padding: 40px;
`;

const StyledReadMoreButton = styled(Button)`
    text-transform: none;
    color: ${colors.accentPrimary};
    font-weight: bold;
`;
