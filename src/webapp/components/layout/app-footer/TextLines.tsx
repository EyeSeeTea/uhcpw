import React from "react";
import styled from "styled-components";

type TextLinesProps = Readonly<{
    lines: ReadonlyArray<string>;
}>;

export const TextLines: React.FC<TextLinesProps> = ({ lines }) => (
    <>
        {lines.map(line => (
            <TextLine key={line}>{line}</TextLine>
        ))}
    </>
);

// Unbreakable lines keep the client's line breaks at every desktop width; the grid column grows to fit them.
const TextLine = styled.span`
    display: block;
    white-space: nowrap;
`;
