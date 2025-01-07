import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import ReactMarkdown from "react-markdown";
import moment from "moment";

import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { Id } from "../../../domain/entities/Ref";
import { useParams } from "react-router-dom";
import { useEditPost } from "./useEditPost";
import { Maybe } from "../../../types/utils";

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

export const EditPostPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: Maybe<Id> }>();

    const { globalMessage, postState } = useEditPost(id);

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage?.type === "error") {
            snackbar.error(globalMessage.text);
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [tabIndex, setTabIndex] = useState(0);
    const [image, setImage] = useState<File | null>(null);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

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
                    <TextField
                        fullWidth
                        label="Título"
                        variant="outlined"
                        margin="normal"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    {/* Campo para la descripción */}
                    <TextField
                        fullWidth
                        label="Descripción"
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <Box mt={2}>
                        <Button variant="contained" component="label">
                            Upload image
                            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                        </Button>
                        {image && <Box mt={1}>Selected image: {image.name}</Box>}
                    </Box>

                    <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                        <Tab label="Write" style={{ color: "black" }} />
                        <Tab label="Preview" style={{ color: "black" }} />
                    </Tabs>

                    <Box mt={2}>
                        {tabIndex === 0 && (
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={10}
                                value={markdown}
                                onChange={e => setMarkdown(e.target.value)}
                            />
                        )}
                        {tabIndex === 1 && (
                            <Box p={2} border={1} borderColor="grey.300" borderRadius={4}>
                                <ReactMarkdown>{markdown}</ReactMarkdown>
                            </Box>
                        )}
                    </Box>
                    <CreateButtonContainer>
                        <CreateNewButton aria-label="Save post" variant="contained" color="primary" onClick={() => {}}>
                            <Typography>{i18n.t("Save")}</Typography>
                        </CreateNewButton>
                    </CreateButtonContainer>
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

const CreateButtonContainer = styled.div`
    max-width: 100px;
    margin-block-start: 20px;
`;
const CreateNewButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    padding: 16px 24px;
    width: 100%;
`;
