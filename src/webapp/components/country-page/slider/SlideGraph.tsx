import { Grid, IconButton, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";
import GetAppIcon from "@material-ui/icons/GetApp";
//import ExpandIcon from "../../../assets/country-page/expand-icon.svg";

type SlideGraphType = {
    title: string;
    graphOne: {
        title: string;
        theme: string;
        image: string;
    };
    graphTwo?: {
        title: string;
        theme: string;
        image: string;
    };
};

export const SlideGraph: React.FC<SlideGraphType> = ({ title, graphOne, graphTwo }) => {
    return (
        <Container>
            <Typography variant="h3" style={{ marginBottom: "50px", fontWeight: 500 }}>
                {i18n.t(title)}
            </Typography>
            <GraphGrid container alignItems="center">
                <Grid item xs={12} md={4}>
                    <Column>
                        <Typography style={{ maxWidth: "80%" }}>{i18n.t(graphOne.title)}</Typography>
                        <Row>
                            <Tag>{graphOne.theme}</Tag>
                            <div style={{ marginTop: "5px", marginLeft: "20px" }}>
                                <IconButton style={{ padding: "5px" }}>
                                    <InfoIcon color="primary" style={{ color: "#035fa7" }} />
                                </IconButton>
                                {/* <IconButton style={{ padding: "5px" }}>
                                    <img src={ExpandIcon} alt="expand icon" />
                                </IconButton> */}
                                <a href={graphOne.image} download>
                                    <IconButton style={{ padding: "5px" }}>
                                        <GetAppIcon
                                            color="primary"
                                            style={{
                                                color: "white",
                                                backgroundColor: "#035fa7",
                                                borderRadius: "50%",
                                                padding: "4px",
                                                fontSize: "12px",
                                            }}
                                        />
                                    </IconButton>
                                </a>
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
                            <Typography style={{ maxWidth: "80%" }}>{i18n.t(graphTwo.title)}</Typography>
                            <Row>
                                <Tag>{graphTwo.theme}</Tag>
                                <div style={{ marginTop: "5px", marginLeft: "20px" }}>
                                    <IconButton style={{ padding: "5px" }}>
                                        <InfoIcon style={{ color: "#035fa7" }} />
                                    </IconButton>
                                    {/* <IconButton style={{ padding: "5px" }}>
                                        <img src={ExpandIcon} alt="expand icon" />
                                    </IconButton> */}
                                    <a href={graphTwo.image} download>
                                        <IconButton style={{ padding: "5px" }}>
                                            <GetAppIcon
                                                color="primary"
                                                style={{
                                                    color: "white",
                                                    backgroundColor: "#035fa7",
                                                    borderRadius: "50%",
                                                    padding: "4px",
                                                    fontSize: "12px",
                                                }}
                                            />
                                        </IconButton>
                                    </a>
                                </div>
                            </Row>
                        </Column>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Image src={graphTwo.image} />
                    </Grid>
                </GraphGrid>
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
