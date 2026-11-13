import React from "react";
import { Button } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";
import styled from "styled-components";

import { colors } from "../../pages/app/themes/dhis2.theme";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { countBlankLinesBefore, splitLines } from "./countBlankLinesBefore";
import { remarkLineBreaks } from "./remarkLineBreaks";

type CountrySummaryProps = {
    text: string;
};

const remarkPlugins = [remarkLineBreaks];

export const CountrySummary: React.FC<CountrySummaryProps> = ({ text }) => {
    const components = useCountrySummaryComponents(text);

    return (
        <Summary>
            <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
                {text}
            </ReactMarkdown>
        </Summary>
    );
};

type SourcePosition = Readonly<{ position?: Readonly<{ start: Readonly<{ line: number }> }> }>;

function useCountrySummaryComponents(text: string): Readonly<Components> {
    return React.useMemo(() => {
        const lines = splitLines(text);
        const blankLinesBefore = (node: SourcePosition) => countBlankLinesBefore(lines, node.position?.start.line ?? 1);

        return {
            a: ({ href, children }) => <ButtonItem href={href}>{children}</ButtonItem>,
            p: ({ node, children }) => <Paragraph $blankLinesBefore={blankLinesBefore(node)}>{children}</Paragraph>,
            ul: ({ node, children }) => <List $blankLinesBefore={blankLinesBefore(node)}>{children}</List>,
            li: ({ children }) => <ListItem>{children}</ListItem>,
            br: () => <LineGap />,
        };
    }, [text]);
}

type ButtonItemProps = {
    href?: string;
    children: React.ReactNode;
};

const ButtonItem: React.FC<ButtonItemProps> = ({ href, children }) => {
    const { redirectWithExternalLink } = useAnalytics();

    return (
        <a href={href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
            <StyledButton>{children}</StyledButton>
        </a>
    );
};

const LINE_HEIGHT = 1.5;
const BLOCK_GAP_PX = 4;
const LINK_BUTTON_GAP_PX = 16;

type BlockProps = { $blankLinesBefore: number };

/** Every line is separated by the block gap. Each blank line written in the text adds one empty line. */
function marginTopForBlankLines({ $blankLinesBefore }: BlockProps): string {
    return `calc(${BLOCK_GAP_PX}px + ${$blankLinesBefore * LINE_HEIGHT}em)`;
}

const Summary = styled.div`
    > :first-child {
        margin-block-start: 0;
    }
`;

const LineGap = styled.span`
    display: block;
    height: ${BLOCK_GAP_PX}px;
`;

const Paragraph = styled.p<BlockProps>`
    margin-block: 0;
    margin-block-start: ${marginTopForBlankLines};
    line-height: ${LINE_HEIGHT};

    > a {
        display: inline-block;
        margin-block-start: ${LINK_BUTTON_GAP_PX}px;
    }
`;

const List = styled.ul<BlockProps>`
    margin-block: 0;
    margin-block-start: ${marginTopForBlankLines};
`;

const ListItem = styled.li`
    line-height: ${LINE_HEIGHT};

    & + & {
        margin-block-start: ${BLOCK_GAP_PX}px;
    }
`;

const StyledButton = styled(Button)`
    background-color: white;
    opacity: 1;
    padding: 5px 30px;
    color: ${colors.accentPrimary};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${colors.greyLight};
    }
`;
