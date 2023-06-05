import { Box, Card, Typography } from "@material-ui/core";
import moment from "moment";

import React from "react";
import styled from "styled-components";
import { Tag } from "../tag/Tag";

export interface SimpleResourceItemProps {
    title: string;
    url: string;
    image: string;
    date: Date;
    dateFormat?: string;
    tag?: string;
    tagColor?: string;
}

export const SimpleResourceItem: React.FC<SimpleResourceItemProps> = React.memo(
    ({ title, url, image, date, dateFormat, tag, tagColor }) => {
        return (
            <Item elevation={0} role="listitem">
                <Column>
                    <a href={url} style={{ width: "100%" }}>
                        <Image src={image} alt={title} />
                    </a>

                    <Box height={20} />
                    <Row>
                        {tag && <Tag theme={tag} color={tagColor} />}

                        <Text variant="body1" gutterBottom>
                            {moment(date).format(dateFormat || "YYYY")}
                        </Text>
                    </Row>
                    <a href={url} style={{ textDecoration: "none", color: "black" }}>
                        <Text variant="body1">{title}</Text>
                    </a>
                </Column>
            </Item>
        );
    }
);

const Item = styled(Card)`
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
`;

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const Text = styled(Typography)`
    font-weight: normal;
`;

const Image = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;
