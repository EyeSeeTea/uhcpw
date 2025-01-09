import { Backdrop, CircularProgress, Container, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Pagination } from "@material-ui/lab";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { useBlog } from "./useBlog";
import { PostItem } from "./PostItem";
import SearchInput from "../../components/search-input/SearchInput";
import { BlogFilters } from "./BlogFilters";

export const BlogPage: React.FC<{ searchParams?: string }> = React.memo(props => {
    const snackbar = useSnackbar();

    const urlParams = useMemo(() => {
        const searchParams = new URLSearchParams(props.searchParams);
        const year = searchParams.get("years");
        return {
            filters: {
                year: year ? year.split(",") : undefined,
            },
        };
    }, [props.searchParams]);

    const { blogState, filters, onGetPosts, onGetPostsByPage, globalMessage } = useBlog({
        yearsFilter: urlParams.filters.year,
    });

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage?.type === "error") {
            snackbar.error(globalMessage.text);
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    return (
        <Layout>
            <TitleContainer>
                <Title variant="h4">{i18n.t("Blog")}</Title>
            </TitleContainer>
            <SearchContainer>
                <SearchInput value={filters.search.term} onChange={filters.search.onTermChange} />
            </SearchContainer>
            <Content>
                {blogState.kind !== "loaded" ? (
                    <Backdrop open style={{ color: "#fff", zIndex: 1 }}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                ) : (
                    <BlogContainer maxWidth="xl">
                        <BlogFilters filters={filters} onGetPosts={onGetPosts} />

                        <StyledGridContainer spacing={2} container direction="row">
                            {blogState.data.paginatedPosts.objects &&
                                blogState.data.paginatedPosts.objects.map((post, index) => {
                                    return (
                                        <Grid key={`${post.id}_${index}`} item lg={4} md={6} xs={12}>
                                            <PostItem
                                                id={post.id}
                                                title={post.title}
                                                description={post.description}
                                                image={post.image}
                                                createdDate={post.createdDate}
                                            />
                                        </Grid>
                                    );
                                })}
                        </StyledGridContainer>

                        <Pagination
                            count={blogState.data.paginatedPosts.pager.pageCount}
                            page={blogState.data.paginatedPosts.pager.page}
                            onChange={onGetPostsByPage}
                            color="primary"
                        />
                    </BlogContainer>
                )}
            </Content>
        </Layout>
    );
});

const Content = styled.div`
    background: white;
    min-height: 100vh;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 32px 64px;
`;

const Title = styled(Typography)`
    text-transform: lowercase;
    :first-letter {
        text-transform: uppercase;
    }
`;

const BlogContainer = styled(Container)`
    padding-block-start: 64px;
    padding-block-end: 32px;
    padding-inline: 64px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;

const StyledGridContainer = styled(Grid)`
    padding-block: 32px;
`;

const SearchContainer = styled.div`
    margin-block: -24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    @media (max-width: 450px) {
        padding: 0 25px;
    }
`;
