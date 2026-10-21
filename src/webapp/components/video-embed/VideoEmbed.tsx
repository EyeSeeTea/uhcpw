import React from "react";
import styled from "styled-components";

type VideoEmbedProps = {
    src: string;
    title: string;
    className?: string;
};

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ src, title, className }) => (
    <Wrapper className={className}>
        <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />
    </Wrapper>
);

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }
`;
