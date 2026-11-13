import { countBlankLinesBefore, splitLines } from "../countBlankLinesBefore";

const summaryWithTwoBlankLines = "**Financial hardship**\n\n* Item\n\n\n**Unmet need**";
const summaryWithWindowsLineBreaks = "**Financial hardship**\r\n\r\n\r\n**Unmet need**";
const summaryStartingWithBlankLines = "\n\n**Unmet need**";

function blankLinesBefore(text: string, lineNumber: number): number {
    return countBlankLinesBefore(splitLines(text), lineNumber);
}

describe("countBlankLinesBefore", () => {
    describe("when there is text above the line", () => {
        it("returns 0 for a line right after text", () => {
            expect(blankLinesBefore("* First\n* Second", 2)).toBe(0);
        });

        it("returns 1 for a line after one blank line", () => {
            expect(blankLinesBefore(summaryWithTwoBlankLines, 3)).toBe(1);
        });

        it("returns every blank line the text has above the line", () => {
            expect(blankLinesBefore(summaryWithTwoBlankLines, 6)).toBe(2);
        });

        it("counts Windows line breaks the same way", () => {
            expect(blankLinesBefore(summaryWithWindowsLineBreaks, 4)).toBe(2);
        });

        it("treats lines with only spaces as blank", () => {
            expect(blankLinesBefore("Text\n   \nMore text", 3)).toBe(1);
        });
    });

    describe("when there is no text above the line", () => {
        it("returns 0 for the first line", () => {
            expect(blankLinesBefore(summaryWithTwoBlankLines, 1)).toBe(0);
        });

        it("returns 0 when only blank lines are above it", () => {
            expect(blankLinesBefore(summaryStartingWithBlankLines, 3)).toBe(0);
        });
    });
});
