import {
    ConfirmationDialog,
    ObjectsList,
    TableConfig,
    useObjectsTable,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";
import React, { useEffect, useMemo } from "react";
import { Button, TableContainer, Typography } from "@material-ui/core";
import styled from "styled-components";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";

import { useAdminBlog } from "./useAdminBlog";
import i18n from "../../../locales";
import { Post } from "../../../domain/entities/blog/Post";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";

const DATE_FORMAT = "DD MMMM YYYY";

export const AdminBlogPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();

    const {
        getPosts,
        pagination,
        initialSorting,
        globalMessage,
        onClickDeletePost,
        onCancelDeletePost,
        currentPostToDelete,
        onClickEditPost,
        onClickCreatePost,
        onDeletePost,
    } = useAdminBlog();

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage?.type === "error") {
            snackbar.error(globalMessage.text);
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    const baseConfig: TableConfig<Post> = useMemo(
        () => ({
            columns: [
                {
                    name: "date",
                    text: i18n.t("Date"),
                    sortable: true,
                    getValue: post => {
                        return moment(post.date).format(DATE_FORMAT);
                    },
                },
                {
                    name: "title",
                    text: i18n.t("Title"),
                    sortable: true,
                },
                {
                    name: "image",
                    text: i18n.t("Image"),
                    sortable: false,
                    getValue: post => {
                        return post.image ? <img src={post.image} alt={post.title} width={100} /> : null;
                    },
                },
                {
                    name: "description",
                    text: i18n.t("Description"),
                    sortable: false,
                    getValue: post => post.description,
                },
            ],
            actions: [
                {
                    name: "edit",
                    text: i18n.t("Edit"),
                    icon: <CreateIcon />,
                    onClick: (selectedIds: string[]) => {
                        onClickEditPost(selectedIds[0] || "");
                    },
                },
                {
                    name: "delete",
                    text: i18n.t("Delete"),
                    icon: <DeleteIcon />,
                    onClick: async (selectedIds: string[]) => {
                        onClickDeletePost(selectedIds[0] || "");
                    },
                },
            ],
            initialSorting,
            paginationOptions: {
                pageSizeOptions: pagination.pageSizeOptions,
                pageSizeInitialValue: pagination.pageSizeInitialValue,
            },
        }),
        [initialSorting, pagination, onClickDeletePost, onClickEditPost]
    );

    const tableProps = useObjectsTable(baseConfig, getPosts);

    return (
        <Layout>
            <TitleContainer>
                <Title variant="h4">{i18n.t("Blog")}</Title>
            </TitleContainer>

            <CreateButtonContainer>
                <CreateNewButton
                    aria-label="Create new post"
                    variant="contained"
                    color="primary"
                    onClick={onClickCreatePost}
                >
                    <Typography>{i18n.t("Create new post")}</Typography>
                </CreateNewButton>
            </CreateButtonContainer>

            <StyledTableContainer>
                <ObjectsList<Post> {...tableProps} columns={tableProps.columns} onChangeSearch={() => {}} />
            </StyledTableContainer>

            {currentPostToDelete !== undefined && (
                <ConfirmationDialog
                    isOpen={true}
                    title={i18n.t("Delete post")}
                    onCancel={onCancelDeletePost}
                    cancelText={i18n.t("Cancel")}
                    onSave={onDeletePost}
                    saveText={i18n.t("Delete")}
                    maxWidth="xs"
                    fullWidth
                >
                    <span>
                        {i18n.t(`Are you sure you want to delete post {{post}} ?`, {
                            post: currentPostToDelete.title,
                        })}
                    </span>
                </ConfirmationDialog>
            )}
        </Layout>
    );
});

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

const CreateButtonContainer = styled.div`
    max-width: 200px;
    padding-inline: 64px;
    margin-block-start: 64px;
`;

const StyledTableContainer = styled(TableContainer)`
    position: relative;
    width: calc(100% - 64px * 2);
    padding-block: 32px;
    padding-inline: 64px;
`;

const CreateNewButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    padding: 16px 24px;
    width: 100%;
`;
