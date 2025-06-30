import { Box, Card, Typography } from "@material-ui/core";
import moment from "moment";

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Tag } from "../tag/Tag";

export interface SimpleResourceItemProps {
    title: string;
    url: string;
    image?: string;
    fallbackImage?: string;
    date: Date;
    dateFormat?: string;
    tag?: string;
    tagColor?: string;
    onTagClick?: () => void;
    maintainAspectRatio?: boolean;
    fullWidth?: boolean;
    redirectWithEvent: (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    disableMainPadding?: boolean;
    hideTag?: boolean;
}

export const SimpleResourceItem: React.FC<SimpleResourceItemProps> = React.memo(
    ({
        title,
        url,
        image,
        fallbackImage,
        date,
        dateFormat,
        tag,
        tagColor,
        onTagClick,
        redirectWithEvent,
        maintainAspectRatio = false,
        fullWidth = true,
        disableMainPadding = false,
        hideTag = false,
    }) => {
        const [imgSrc, setImgSrc] = useState(image);

        const handleImageError = useCallback(() => {
            if (fallbackImage) {
                setImgSrc(fallbackImage);
            }
        }, [fallbackImage]);

        return (
            <Item elevation={0} role="listitem" $disablePadding={disableMainPadding}>
                <Column>
                    <a
                        href={url}
                        style={{ width: "100%" }}
                        target="_blank"
                        rel="noreferrer"
                        onClick={redirectWithEvent}
                    >
                        <Image
                            src={imgSrc || fallbackImage}
                            onError={handleImageError}
                            alt={title}
                            $maintainAspectRatio={maintainAspectRatio}
                            $fullWidth={fullWidth}
                        />
                    </a>

                    <Box height={20} />

                    <Content $hasPadding={disableMainPadding}>
                        <Row>
                            {tag && !hideTag && <Tag theme={tag} color={tagColor} onClick={onTagClick} />}

                            <Text gutterBottom>{moment(date).format(dateFormat || "YYYY")}</Text>
                        </Row>
                        <a
                            href={url}
                            style={{ textDecoration: "none", color: "black" }}
                            target="_blank"
                            rel="noreferrer"
                            onClick={redirectWithEvent}
                        >
                            <Text>{title}</Text>
                        </a>
                    </Content>
                </Column>
            </Item>
        );
    }
);

const Content = styled.div<{ $hasPadding?: boolean }>`
    padding: ${props => (props.$hasPadding ? "0 16px 16px 16px" : "0px")};
`;

const Item = styled(Card)<{ $disablePadding?: boolean }>`
    border-radius: 10px;
    padding-block: ${props => (props.$disablePadding ? "0px" : "16px")};
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
    object-fit: cover;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
