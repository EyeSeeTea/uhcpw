type MarkdownNode = Readonly<{
    type: string;
    value?: string;
    children?: ReadonlyArray<MarkdownNode>;
}>;

const lineBreakNode: MarkdownNode = { type: "break" };

/** Markdown joins two lines of text that have no blank line between them. This keeps each line on its own. */
export function remarkLineBreaks() {
    return (tree: MarkdownNode): MarkdownNode => splitSoftLineBreaks(tree);
}

export function splitSoftLineBreaks(node: MarkdownNode): MarkdownNode {
    if (!node.children) return node;

    return {
        ...node,
        children: node.children.flatMap(child =>
            child.type === "text" && child.value !== undefined
                ? textWithLineBreaks(child.value)
                : [splitSoftLineBreaks(child)]
        ),
    };
}

function textWithLineBreaks(value: string): ReadonlyArray<MarkdownNode> {
    return value
        .split("\n")
        .flatMap((line, index): ReadonlyArray<MarkdownNode> => {
            const text: MarkdownNode = { type: "text", value: line };
            return index === 0 ? [text] : [lineBreakNode, text];
        })
        .filter(node => node.value !== "");
}
