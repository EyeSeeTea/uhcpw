import React from "react";
import styled, { css } from "styled-components";
import { narrowDesktopFooterQuery } from "./footerStyles";

type TextLinesProps = Readonly<{
    lines: ReadonlyArray<string>;
    isFlowingWhenNarrow?: boolean;
}>;

// The trailing space inside each line separates the words when the lines join into one flowing text.
export const TextLines: React.FC<TextLinesProps> = ({ lines, isFlowingWhenNarrow = false }) => (
    <>
        {lines.map(line => (
            <TextLine key={line} $isFlowingWhenNarrow={isFlowingWhenNarrow}>
                {`${line} `}
            </TextLine>
        ))}
    </>
);

// Unbreakable lines keep the client's line breaks whatever the width of the container. Flowing ones join into a
// normal paragraph on a narrow desktop footer, where the client's lines no longer fit their column.
const TextLine = styled.span<{ $isFlowingWhenNarrow: boolean }>`
    display: block;
    white-space: nowrap;

    ${props =>
        props.$isFlowingWhenNarrow &&
        css`
            @media ${narrowDesktopFooterQuery} {
                display: inline;
                white-space: normal;
            }
        `}
`;
