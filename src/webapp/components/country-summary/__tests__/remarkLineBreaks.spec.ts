import { splitSoftLineBreaks } from "../remarkLineBreaks";

const lineBreak = { type: "break" };

function paragraph(...children: ReadonlyArray<{ type: string; value?: string }>) {
    return { type: "root", children: [{ type: "paragraph", children }] };
}

function text(value: string) {
    return { type: "text", value };
}

describe("splitSoftLineBreaks", () => {
    it("keeps text without line breaks as it is", () => {
        expect(splitSoftLineBreaks(paragraph(text("Unmet need")))).toEqual(paragraph(text("Unmet need")));
    });

    it("puts a line break between two lines of the same text", () => {
        expect(splitSoftLineBreaks(paragraph(text("First line\nSecond line")))).toEqual(
            paragraph(text("First line"), lineBreak, text("Second line"))
        );
    });

    it("splits the text that follows a bold title on the line above", () => {
        const title = { type: "strong", children: [text("Unmet need")] };

        expect(splitSoftLineBreaks(paragraph(title, text("\nNot available")))).toEqual(
            paragraph(title, lineBreak, text("Not available"))
        );
    });
});
