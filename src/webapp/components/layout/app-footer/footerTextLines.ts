// The desktop footer breaks these texts at the points the client asked for: each word opens a new line.
// A text without those words (edited in DHIS2 or translated) stays in one piece and wraps naturally.
const disclaimerLineStarts = ["understood", "Nations", "(1999)"] as const;
const fundingLineStarts = ["acknowledges", "Autonomous"] as const;
const barcelonaOfficeLineStarts = ["Health"] as const;

export function getDisclaimerLines(text: string): ReadonlyArray<string> {
    return splitIntoLines(text, disclaimerLineStarts);
}

export function getFundingLines(text: string): ReadonlyArray<string> {
    return splitIntoLines(text, fundingLineStarts);
}

export function getBarcelonaOfficeLines(text: string): ReadonlyArray<string> {
    return splitIntoLines(text, barcelonaOfficeLineStarts);
}

type SplitState = Readonly<{ lines: ReadonlyArray<string>; rest: string }>;

function splitIntoLines(text: string, lineStarts: ReadonlyArray<string>): ReadonlyArray<string> {
    const { lines, rest } = lineStarts.reduce<SplitState>(
        (state, lineStart) => {
            const breakIndex = state.rest.indexOf(` ${lineStart}`);

            return breakIndex < 0
                ? state
                : {
                      lines: [...state.lines, state.rest.slice(0, breakIndex)],
                      rest: state.rest.slice(breakIndex + 1),
                  };
        },
        { lines: [], rest: text }
    );

    return [...lines, rest];
}
