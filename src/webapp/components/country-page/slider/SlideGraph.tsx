import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled, { css } from "styled-components";
import { useState } from "react";
import { NotesDialog } from "../../dialog/NotesDialog";
import { ActionButtons } from "../graphs/ActionButtons";

type SlideGraphType = {
    title: string;
    graphOne: {
        title: string;
        theme: string;
        image: string;
        dialogInfo: {
            title?: string;
            infoNotes: string[];
            sourceName: string;
            sourceLink: string;
        };
    };
    graphTwo?: {
        title: string;
        theme: string;
        image: string;
        dialogInfo: {
            title?: string;
            infoNotes: string[];
            sourceName: string;
            sourceLink: string;
        };
    };
};

export const SlideGraph: React.FC<SlideGraphType> = ({ title, graphOne, graphTwo }) => {
    const [isGraphOneOpen, setIsGraphOneOpen] = useState(false);
    const [isGraphTwoOpen, setIsGraphTwoOpen] = useState(false);
    return (
        <Container>
            <Typography variant="h3" style={{ marginBottom: "50px", fontWeight: 500, fontSize: "2rem" }}>
                {i18n.t(title)}
            </Typography>
            <GraphGrid container alignItems="center">
                <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Column>
                        <Typography variant="h4" style={{ fontSize: "16px", fontWeight: "bold" }}>
                            {i18n.t(graphOne.title)}
                        </Typography>
                        <Row>
                            <Tag>{graphOne.theme}</Tag>
                            <div style={{ marginLeft: "20px" }}>
                                <ActionButtons
                                    onIconButtonClick={() => setIsGraphOneOpen(true)}
                                    graphImage={graphOne.image}
                                />
                            </div>
                        </Row>
                    </Column>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Image src={graphOne.image} />
                </Grid>
            </GraphGrid>
            {graphTwo && (
                <GraphGrid container alignItems="center" style={{ marginTop: "50px" }}>
                    <Grid item xs={12} md={12}>
                        <Column>
                            <Typography variant="h4" style={{ fontSize: "16px", fontWeight: "bold" }}>
                                {i18n.t(graphTwo.title)}
                            </Typography>
                            <Row>
                                <Tag>{graphTwo.theme}</Tag>
                                <div style={{ marginLeft: "20px" }}>
                                    <ActionButtons
                                        onIconButtonClick={() => setIsGraphTwoOpen(true)}
                                        graphImage={graphTwo.image}
                                    />
                                </div>
                            </Row>
                        </Column>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Image src={graphTwo.image} />
                    </Grid>
                </GraphGrid>
            )}
            <NotesDialog isOpen={isGraphOneOpen} setIsOpen={setIsGraphOneOpen} dialogInfo={graphOne.dialogInfo} />
            {graphTwo && (
                <NotesDialog isOpen={isGraphTwoOpen} setIsOpen={setIsGraphTwoOpen} dialogInfo={graphTwo.dialogInfo} />
            )}
        </Container>
    );
};

const visuallyHidden = css`
    position: absolute;
    width: 0.0625rem;
    height: 0.0625rem;
    overflow: hidden;
    white-space: nowrap;
    clip: rect(0 0 0 0);
    clip-path: inset(100%);
`;

const Container = styled.div`
    @media (min-width: 960px) {
        padding-inline: 30px;
        padding-block: 46px;
        max-width: 900px;
        > h3 {
            ${visuallyHidden};
        }
    }
`;

const GraphGrid = styled(Grid)``;

const Tag = styled.div`
    border-radius: 20px;
    background-color: #008ad7;
    color: white;
    padding: 6px 16px;
    display: inline-block;
    white-space: nowrap;
    font-size: 14px;
    font-weight: regular;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    padding-block-end: 15px;
    @media (min-width: 960px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
        padding-block-end: 30px;
        width: 100%;
    }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    @media (min-width: 960px) {
        flex: 1;
        justify-content: flex-end;
    }
`;

const Image = styled.img`
    height: auto;
    width: 100%;
`;
