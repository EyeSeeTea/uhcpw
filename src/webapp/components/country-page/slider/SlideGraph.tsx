import { Grid, Typography as Title } from "@material-ui/core";
import i18n from "../../../../locales";
import styled from "styled-components";
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
            <Typography variant="h3" style={{ marginBottom: "50px", fontWeight: 500 }}>
                {i18n.t(title)}
            </Typography>
            <GraphGrid container alignItems="center">
                <Grid item xs={12} md={4}>
                    <Column>
                        <Typography variant="h4" style={{ maxWidth: "80%" }}>
                            {i18n.t(graphOne.title)}
                        </Typography>
                        <Row>
                            <Tag>{graphOne.theme}</Tag>
                            <div style={{ marginTop: "5px", marginLeft: "20px" }}>
                                <ActionButtons
                                    onIconButtonClick={() => setIsGraphOneOpen(true)}
                                    graphImage={graphOne.image}
                                />
                            </div>
                        </Row>
                    </Column>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Image src={graphOne.image} />
                </Grid>
            </GraphGrid>
            {graphTwo && (
                <GraphGrid container alignItems="center" style={{ marginTop: "50px" }}>
                    <Grid item xs={12} md={4}>
                        <Column>
                            <Typography variant="h4" style={{ maxWidth: "80%" }}>
                                {i18n.t(graphTwo.title)}
                            </Typography>
                            <Row>
                                <Tag>{graphTwo.theme}</Tag>
                                <div style={{ marginTop: "5px", marginLeft: "20px" }}>
                                    <ActionButtons
                                        onIconButtonClick={() => setIsGraphTwoOpen(true)}
                                        graphImage={graphTwo.image}
                                    />
                                </div>
                            </Row>
                        </Column>
                    </Grid>
                    <Grid item xs={12} md={8}>
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

const Container = styled.div`
    padding: 15px 10px 20px 30px;
`;

const GraphGrid = styled(Grid)``;

const Tag = styled.div`
    border-radius: 20px;
    background: #efefef;
    background-color: #621e1e;
    color: white;
    padding: 4px 16px;
    margin-top: 8px;
    display: inline-block;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;

const Image = styled.img`
    width: 70%;
    height: auto;
`;

const Typography = styled(Title)`
    @media (min-width: 960px) {
        display: none;
    }
`;
