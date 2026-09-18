import { getBarcelonaOfficeLines, getDisclaimerLines, getFundingLines } from "../footerTextLines";

const disclaimer =
    "* All references to Kosovo should be understood to be in the context of the United Nations Security Council resolution 1244 (1999)";
const funding =
    "The WHO Regional Office for Europe gratefully acknowledges funding from the Government of the Autonomous Community of Catalonia, Spain";

describe("footerTextLines", () => {
    describe("getDisclaimerLines", () => {
        it("splits the disclaimer into the four lines requested by the client", () => {
            expect(getDisclaimerLines(disclaimer)).toEqual([
                "* All references to Kosovo should be",
                "understood to be in the context of the United",
                "Nations Security Council resolution 1244",
                "(1999)",
            ]);
        });

        it("keeps a text without the break words in a single line", () => {
            const translated = "* Todas las referencias a Kosovo se entienden en el contexto de la resolución 1244";

            expect(getDisclaimerLines(translated)).toEqual([translated]);
        });
    });

    describe("getFundingLines", () => {
        it("splits the funding acknowledgement into the three lines requested by the client", () => {
            expect(getFundingLines(funding)).toEqual([
                "The WHO Regional Office for Europe gratefully",
                "acknowledges funding from the Government of the",
                "Autonomous Community of Catalonia, Spain",
            ]);
        });
    });

    describe("getBarcelonaOfficeLines", () => {
        it("splits the Barcelona Office link into the two lines requested by the client", () => {
            expect(getBarcelonaOfficeLines("WHO Barcelona Office for Health Systems Financing")).toEqual([
                "WHO Barcelona Office for",
                "Health Systems Financing",
            ]);
        });
    });
});
