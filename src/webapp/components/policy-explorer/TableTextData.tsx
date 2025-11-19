import React, { RefObject, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Components } from "react-markdown/lib/ast-to-react";

import { PolicyExplorerCell } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

export const EMPTY_URL = "/";

export const TableTextData = React.memo(
    ({ cell, referencesRef }: { cell: PolicyExplorerCell; referencesRef: RefObject<HTMLDivElement> }) => {
        const { redirectWithExternalLink } = useAnalytics();

        const handleClickEmptyUrl = useCallback(
            event => {
                event.preventDefault();
                referencesRef.current?.scrollIntoView({ behavior: "smooth" });
            },
            [referencesRef]
        );

        const markdownComponents: Components = React.useMemo(
            () => ({
                a: ({ href, children, ...props }) => {
                    return href === EMPTY_URL ? (
                        <a href={href} {...props} onClick={handleClickEmptyUrl}>
                            {children}
                        </a>
                    ) : (
                        <a href={href} {...props} onClick={redirectWithExternalLink}>
                            {children}
                        </a>
                    );
                },
                li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
                ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
            }),
            [handleClickEmptyUrl, redirectWithExternalLink]
        );

        return (
            <ReactMarkdown components={markdownComponents}>
                {cell.references
                    ? `${cleanMarkdownEmptyLinks(cell.value)}\n\n${cell.references}`
                    : cleanMarkdownEmptyLinks(cell.value)}
            </ReactMarkdown>
        );
    }
);

function cleanMarkdownEmptyLinks(value: string) {
    const regex = /\[[^\]]+\](?!\([^)]+\))/gu;

    return value.replace(regex, match => {
        return match + `(${EMPTY_URL})`;
    });
}

const StyledLi = styled.li`
    line-height: 1.43;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
`;
