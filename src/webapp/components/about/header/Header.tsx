import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import i18n from "../../../../locales";
import { OfficeInfo } from "../../../../domain/entities/about/OfficeInfo";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

export const Header: React.FC<{ officeInfo: OfficeInfo | undefined }> = React.memo(({ officeInfo }) => {
    const { redirectWithPageView } = useAnalytics();

    const videoPageView = redirectWithPageView({ title: "[Video] WHO Barcelona Office" });

    if (!officeInfo) return null;

    return (
        <HeaderGrid container spacing={5} alignItems="flex-start">
            <Grid item md={6} xs={12}>
                <a href={officeInfo.officeVideo} target="_blank" rel="noreferrer" onClick={videoPageView}>
                    <img
                        style={{ paddingBlockStart: "16px" }}
                        width="100%"
                        alt="WHO Barcelona Office"
                        src={officeInfo.officeImage}
                    />
                </a>
                <Caption role="caption">{i18n.t("WHO Barcelona Office for Health Systems Financing")}</Caption>
            </Grid>
            <Grid item md={6} xs={12}>
                <Container maxWidth="sm">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <Text>{children}</Text>,
                        }}
                    >
                        {i18n.t(officeInfo.officeText)}
                    </ReactMarkdown>
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
    margin-block-start: 1em;
    margin-block-end: 1em;
`;
