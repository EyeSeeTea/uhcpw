import { Backdrop, CircularProgress, Container, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import ReactMarkdown from "react-markdown";
import moment from "moment";

import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { Id } from "../../../domain/entities/Ref";
import { useParams } from "react-router-dom";
import { usePost } from "./usePost";

const DATE_FORMAT = "DD MMMM YYYY";

const markdownComponents = {
    p: ({ children }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
        <Typography variant="body2" style={{ marginBottom: "0px" }}>
            {children}
        </Typography>
    ),
    ul: ({ children }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
        <ul style={{ paddingLeft: "1.2em" }}>{children}</ul>
    ),
    li: ({ children }: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>) => (
        <li>
            <Typography variant="body2">{children}</Typography>
        </li>
    ),
    a: ({ ...props }) => (
        <TextLink href={props.href} target="_blank" rel="noreferrer">
            {props.children}
        </TextLink>
    ),
    img: ({ ...props }) => (
        <img
            {...props}
            src={props.src}
            alt={props.alt}
            style={{
                width: "150px",
                borderRadius: "10px",
                margin: "20px 0",
            }}
        />
    ),
};

export const PostPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: Id }>();

    const { globalMessage, postState } = usePost(id);

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
            {postState.kind !== "loaded" ? (
                <Backdrop open style={{ color: "#fff", zIndex: 1 }}>
                    <CircularProgress color="primary" />
                </Backdrop>
            ) : (
                <PostContainer>
                    <Image src={postState.data.image} alt={postState.data.title} />

                    <TextDate gutterBottom>{moment(postState.data.createdDate).format(DATE_FORMAT)}</TextDate>

                    <PostTitle variant="h5">{postState.data.title}</PostTitle>

                    {postState.data.description ? <Description>{postState.data.description}</Description> : null}

                    <Content>
                        <ReactMarkdown components={markdownComponents}>{postState.data.content}</ReactMarkdown>
                    </Content>
                </PostContainer>
            )}
        </Layout>
    );
});

const PostContainer = styled(Container)`
    padding-block-start: 64px;
    padding-block-end: 32px;
    padding-inline: 64px;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 32px 64px;
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const Title = styled(Typography)`
    text-transform: lowercase;
    :first-letter {
        text-transform: uppercase;
    }
`;

const PostTitle = styled(Typography)`
    font-weight: bold;
`;

const Description = styled(Typography)`
    font-weight: normal;
`;

const TextDate = styled(Typography)`
    margin-block-end: 5px;
    font-weight: normal;
`;

const Image = styled.img<{ $fullWidth?: boolean }>`
    width: 100%;
    max-height: 450px;
    object-fit: contain;
    margin-block-end: 30px;
`;

const Content = styled.div`
    margin-block-start: 24px;
`;
