const lineBreak = /\r?\n/;

export function splitLines(text: string): ReadonlyArray<string> {
    return text.split(lineBreak);
}

/**
 * Counts the blank lines between the given line and the text above it. Line numbers start at 1.
 * Blank lines at the start of the text count as 0.
 */
export function countBlankLinesBefore(lines: ReadonlyArray<string>, lineNumber: number): number {
    const linesAbove = lines.slice(0, Math.max(lineNumber - 1, 0));
    const lastTextLineIndex = linesAbove.map(line => line.trim() !== "").lastIndexOf(true);

    return lastTextLineIndex === -1 ? 0 : linesAbove.length - 1 - lastTextLineIndex;
}
