import { Box, Fab, Grid, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import ChevronRightSharpIcon from "@material-ui/icons/ChevronRightSharp";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";

export interface ResourceGroupProps {
    title: string;
    seeAllUrl: string;
    isMobile?: boolean;
}

export const ResourceGroup: React.FC<ResourceGroupProps> = React.memo(
    ({ title, seeAllUrl, children, isMobile = false }) => {
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
                {isMobile ? (
                    children
                ) : (
                    <Grid container spacing={1}>
                        {children}
                    </Grid>
                )}
            </Container>
        );
    }
);

const Container = styled.div`
    padding: 32px;
    padding-inline-start: 0;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 0;
    }
`;

const Row = styled.div`
    padding-top: 8px;
    padding-inline-start: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-block: 24px 16px;
    }
`;

const Title = styled(Typography)`
    text-transform: lowercase;
    :first-letter {
        text-transform: uppercase;
    }
`;
