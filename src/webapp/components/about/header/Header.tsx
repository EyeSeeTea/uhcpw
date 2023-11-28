import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import i18n from "../../../../locales";
import WhoBarcelona from "../../../assets/about-pic-video.png";

export const Header: React.FC = React.memo(() => {
    return (
        <HeaderGrid container spacing={5} alignItems="center">
            <Grid item md={6} xs={12}>
                <a href="https://www.youtube.com/watch?v=k8OQYkjgERk&t=4s" target="_blank" rel="noreferrer">
                    <img width="100%" alt="WHO Barcelona Office" src={WhoBarcelona} />
                </a>
                <Caption role="caption">{i18n.t("WHO Barcelona Office for Health Systems Financing")}</Caption>
            </Grid>
            <Grid item md={6} xs={12}>
                <Container maxWidth="sm">
                    <p>
                        <Text gutterBottom>
                            {i18n.t(
                                "The WHO Barcelona Office is a centre of excellence in health financing for universal health coverage (UHC). It works with Member States across WHO’s European Region to promote evidence-informed policy making and offers WHO training courses on health financing."
                            )}
                        </Text>
                    </p>

                    <p>
                        <Text gutterBottom>
                            {i18n.t(
                                "The Office assesses country and regional progress towards UHC by monitoring financial protection – affordable access to health care. It also supports countries to strengthen financial protection through tailored technical assistance, including analysis of country-specific policy options, high-level policy dialogue and the sharing of international experience."
                            )}
                        </Text>
                    </p>
                    <p>
                        <Text gutterBottom>
                            {i18n.t(
                                "Established in 1999, the Office is supported by the Government of the Autonomous Community of Catalonia, Spain. It is part of the Division of Country Health Policies and Systems of the WHO Regional Office for Europe."
                            )}
                        </Text>
                    </p>
                </Container>
            </Grid>
        </HeaderGrid>
    );
});

const HeaderGrid = styled(Grid)`
    margin-top: 0px;
    color: white;
    padding: 32px;
`;

const Caption = styled(Typography)`
    font-weight: 300;
    margin-top: 20px;
`;

const Text = styled(Typography)`
    font-weight: 300;
`;
