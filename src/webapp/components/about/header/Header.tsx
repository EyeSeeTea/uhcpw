import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import i18n from "../../../../locales";
import WhoBarcelonaOffice from "../../../assets/who-barcelona-office.jpg";

export const Header: React.FC = React.memo(() => {
    return (
        <HeaderGrid container spacing={5} alignItems="center">
            <Grid item md={6} xs={12}>
                <HeaderTitle>
                    {i18n.t(
                        "❝ The WHO Barcelona Office is a centre of excellence in health financing for universal health coverage ❞"
                    )}
                </HeaderTitle>
                <img width="100%" alt="WHO Barcelona Office" src={WhoBarcelonaOffice} />
            </Grid>
            <Grid item md={6} xs={12}>
                <Container maxWidth="sm">
                    <p>
                        <Text gutterBottom variant="body2">
                            {i18n.t(
                                "The WHO Barcelona Office is a centre of excellence in health financing for universal health coverage. It works with Member State across WHO's European Region to promote evidence-informed policy making"
                            )}
                        </Text>
                    </p>

                    <p>
                        <Text gutterBottom variant="body2">
                            {i18n.t(
                                "A key part of the work of the Office is to assess country and regional progress towards universal health coverage by monitoring financial protection - the impact of out-of-pocket payments for health on living standards and proverty. Financial protection is a core dimension of health system performance and an indicator for the Sustainable Development Goals."
                            )}
                        </Text>
                    </p>
                    <p>
                        <Text gutterBottom variant="body2">
                            {i18n.t(
                                "The Office supports countries to develop policy, monitor progress and design reforms through health system problem diagnosis, analysis of country-specific policy options, high-level policy dialogue and the sharing of international experience. It is also the home for WHO training courses on health financing and health systems strengthening for the better health outcomes."
                            )}
                        </Text>
                        <Text gutterBottom variant="body2">
                            {i18n.t(
                                "Established in 1999, the Office is supported by the Government of the Autonomous Community of Catalonia, Spain. It is part of the Division of Country Health Policies and Systems of the WHO Region Office for Europe."
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

const HeaderTitle = styled(Typography)`
    font-size: 25px;
    font-weight: 300;
    margin-bottom: 24px;
`;

const Text = styled(Typography)`
    font-size: 17px;
    font-weight: 300;
`;
