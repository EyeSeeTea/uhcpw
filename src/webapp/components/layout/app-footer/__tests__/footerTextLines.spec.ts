import {
    getBarcelonaOfficeLines,
    getDesktopFundingLines,
    getDisclaimerLines,
    getEuropeanUnionLines,
    getMobileFundingLines,
} from "../footerTextLines";

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

    describe("getDesktopFundingLines", () => {
        it("splits the funding acknowledgement into the three desktop lines requested by the client", () => {
            expect(getDesktopFundingLines(funding)).toEqual([
                "The WHO Regional Office for Europe gratefully",
                "acknowledges funding from the Government of the",
                "Autonomous Community of Catalonia, Spain",
            ]);
        });
    });

    describe("getMobileFundingLines", () => {
        it("splits the funding acknowledgement into the three mobile lines requested by the client", () => {
            expect(getMobileFundingLines(funding)).toEqual([
                "The WHO Regional Office for Europe gratefully",
                "acknowledges funding from the Government of",
                "the Autonomous Community of Catalonia, Spain",
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

    describe("getEuropeanUnionLines", () => {
        it("splits the EU co-funding label into two lines", () => {
            expect(getEuropeanUnionLines("Co-funded by the European Union")).toEqual([
                "Co-funded by the",
                "European Union",
            ]);
        });
    });
});
