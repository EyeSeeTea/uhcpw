import { Box, Fab, Grid, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import ChevronRightSharpIcon from "@material-ui/icons/ChevronRightSharp";

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
        <Container aria-label={title}>
            <Row>
                <Title variant="h5">{title}</Title>
                <Box width={2} />
                <Fab
                    aria-label={`go to ${title}`}
                    color="primary"
                    size="small"
                    style={{ boxShadow: "none", transform: "scale(0.7)" }}
                >
                    <ChevronRightSharpIcon onClick={onSeeAll} />
                </Fab>
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
    padding-left: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Title = styled(Typography)`
    text-transform: lowercase;
    :first-letter {
        text-transform: uppercase;
    }
`;
