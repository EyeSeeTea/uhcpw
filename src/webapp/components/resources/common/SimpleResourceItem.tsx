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
    onTagClick?: () => void;
    maintainAspectRatio?: boolean;
    fullWidth?: boolean;
}

export const SimpleResourceItem: React.FC<SimpleResourceItemProps> = React.memo(
    ({
        title,
        url,
        image,
        date,
        dateFormat,
        tag,
        tagColor,
        onTagClick,
        maintainAspectRatio = false,
        fullWidth = true,
    }) => {
        return (
            <Item elevation={0} role="listitem">
                <Column>
                    <a href={url} style={{ width: "100%" }} target="_blank" rel="noreferrer">
                        <Image
                            src={image}
                            alt={title}
                            $maintainAspectRatio={maintainAspectRatio}
                            $fullWidth={fullWidth}
                        />
                    </a>

                    <Box height={20} />
                    <Row>
                        {tag && <Tag theme={tag} color={tagColor} onClick={onTagClick} />}

                        <Text gutterBottom>{moment(date).format(dateFormat || "YYYY")}</Text>
                    </Row>
                    <a href={url} style={{ textDecoration: "none", color: "black" }} target="_blank" rel="noreferrer">
                        <Text>{title}</Text>
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

const Image = styled.img<{ $maintainAspectRatio?: boolean; $fullWidth?: boolean }>`
    width: ${props => (props.$fullWidth ? "100%" : "unset")};
    height: 300px;
    object-fit: ${props => (props.$maintainAspectRatio ? "contain" : "cover")};
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
