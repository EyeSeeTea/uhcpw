import { Card, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import i18n from "../../../locales";
import { colors } from "../app/themes/dhis2.theme";

export type PostItemProps = {
    id: string;
    title: string;
    description?: string;
    image?: string;
    createdDate: string;
    fullWidth?: boolean;
};

const DATE_FORMAT = "DD MMMM YYYY";

export const PostItem: React.FC<PostItemProps> = React.memo(props => {
    const { id, title, description, image, createdDate, fullWidth = true } = props;

    return (
        <Item elevation={0} role="listitem">
            <Column>
                <Image src={image} alt={title} $fullWidth={fullWidth} />

                <TextDate gutterBottom>{moment(createdDate).format(DATE_FORMAT)}</TextDate>

                <Title>{title}</Title>

                {description ? <Description>{description}</Description> : null}

                <StyledLink to={`/blog/${id}`}>{i18n.t("Read more")}</StyledLink>
            </Column>
        </Item>
    );
});

const Item = styled(Card)`
    border-radius: 10px;
    padding-block: 16px;
    flex-direction: column;
`;

const Column = styled.div`
    padding-block-end: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;
`;

const Title = styled(Typography)`
    font-weight: bold;
`;

const Description = styled(Typography)`
    font-weight: normal;
`;

const TextDate = styled(Typography)`
    margin-block-end: 5px;
    font-weight: normal;
`;

const StyledLink = styled(Link)`
    margin-block-start: 5px;
    color: ${colors.accentPrimary};
    font-weight: bold;
`;

const Image = styled.img<{ $fullWidth?: boolean }>`
    width: ${props => (props.$fullWidth ? "100%" : "unset")};
    height: 300px;
    object-fit: cover;
    margin-block-end: 30px;
`;
