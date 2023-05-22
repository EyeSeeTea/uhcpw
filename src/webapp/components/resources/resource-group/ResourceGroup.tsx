import { Grid, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import ChevronRightSharpIcon from "@material-ui/icons/ChevronRightSharp";
import { Avatar } from "material-ui";
import { colors } from "../../../pages/app/themes/dhis2.theme";

export interface ResourceGroupProps {
    title: string;
    seeAllUrl: string;
}

export const ResourceGroup: React.FC<ResourceGroupProps> = React.memo(({ title, seeAllUrl, children }) => {
    const history = useHistory();

    const onSeeAll = useCallback(() => {
        history.push(seeAllUrl);
    }, [history, seeAllUrl]);

    return (
        <Container>
            <Row>
                <Typography variant="h5">{title}</Typography>
                <Avatar backgroundColor={colors.accentPrimary} size={22} style={{ marginLeft: 20 }}>
                    <ChevronRightSharpIcon onClick={onSeeAll} />
                </Avatar>
            </Row>
            <Grid container spacing={0}>
                {children}
            </Grid>
        </Container>
    );
});

const Container = styled.div`
    padding: 32px;
`;

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;
