import { describe, it, expect } from "vitest";
import type { AboutPageData } from "@/data/about/about-data";
import type { MethodsPageData } from "@/data/methods/methods-data";
import type { AreaMarkerFeature } from "../serializers";
import {
    serializeHomeMarkdown,
    serializeAboutMarkdown,
    serializeMethodsMarkdown,
    serializeAreaOverviewMarkdown,
    serializeLlmsTxt,
} from "../serializers";

const NO_CHROME_PATTERNS: ReadonlyArray<RegExp> = [
    /<header/i,
    /<footer/i,
    /<nav/i,
    /<script/i,
    /<link rel=/i,
    /<!doctype/i,
];

function assertNoChrome(body: string): void {
    NO_CHROME_PATTERNS.forEach(pattern => {
        expect(body).not.toMatch(pattern);
    });
}

describe("serializeHomeMarkdown", () => {
    it("renders H1 from title followed by summary", () => {
        const body = serializeHomeMarkdown("A short summary of the site.", "UHC Watch");
        expect(body).toBe("# UHC Watch\n\nA short summary of the site.\n");
    });

    it("trims whitespace in the summary", () => {
        const body = serializeHomeMarkdown("\n  trimmed  \n", "UHC Watch");
        expect(body).toBe("# UHC Watch\n\ntrimmed\n");
    });

    it("contains no HTML chrome", () => {
        const body = serializeHomeMarkdown("Summary", "UHC Watch");
        assertNoChrome(body);
    });
});

describe("serializeAboutMarkdown", () => {
    const baseAbout: AboutPageData = {
        team: [
            {
                image: "",
                firstName: "Ada",
                lastName: "Lovelace",
                position: "Director",
                countryName: "",
            },
            {
                image: "",
                firstName: "Grace",
                lastName: "Hopper",
                position: "Senior Researcher",
                countryName: "",
            },
        ],
        experts: [
            {
                image: "",
                firstName: "Marie",
                lastName: "Curie",
                position: "Senior researcher",
                countryName: "France",
            },
            {
                image: "",
                firstName: "Alan",
                lastName: "Turing",
                position: "Senior researcher",
                countryName: "United Kingdom",
            },
        ],
        officeInfo: {
            officeText: "The office works on **financial protection**.",
            officeVideo: "",
            officeImage: "",
        },
        officeImage: { src: "", width: 0, height: 0 },
        countryTreeOptions: [],
        parentSortOrder: [],
        generalContent: {} as AboutPageData["generalContent"],
    };

    it("emits H1, office text body, and a Team section with ASCII-only bullets", () => {
        const body = serializeAboutMarkdown(baseAbout, "UHC Watch - About");
        expect(body.startsWith("# UHC Watch - About\n\n")).toBe(true);
        expect(body).toContain("The office works on **financial protection**.");
        expect(body).toContain("## Team");
        expect(body).toContain("- Ada Lovelace - Director");
        expect(body).toContain("- Grace Hopper - Senior Researcher");
        expect(body).not.toMatch(/[\u2014\u2013]/);
        expect(body.endsWith("\n")).toBe(true);
    });

    it("emits an Experts section with country appended to each bullet", () => {
        const body = serializeAboutMarkdown(baseAbout, "UHC Watch - About");
        expect(body).toContain("## Experts");
        expect(body).toContain("- Marie Curie - Senior researcher, France");
        expect(body).toContain("- Alan Turing - Senior researcher, United Kingdom");
    });

    it("omits Team section when team is empty", () => {
        const body = serializeAboutMarkdown({ ...baseAbout, team: [] }, "UHC Watch - About");
        expect(body).not.toContain("## Team");
        expect(body).toContain("## Experts");
    });

    it("omits Experts section when experts are empty", () => {
        const body = serializeAboutMarkdown({ ...baseAbout, experts: [] }, "UHC Watch - About");
        expect(body).not.toContain("## Experts");
        expect(body).toContain("## Team");
    });

    it("falls back to name only when position and country are empty", () => {
        const body = serializeAboutMarkdown(
            {
                ...baseAbout,
                team: [{ image: "", firstName: "Anon", lastName: "User", position: "", countryName: "" }],
                experts: [],
            },
            "UHC Watch - About"
        );
        expect(body).toContain("- Anon User");
        expect(body).not.toContain("- Anon User -");
    });

    it("contains no HTML chrome", () => {
        const body = serializeAboutMarkdown(baseAbout, "UHC Watch - About");
        assertNoChrome(body);
    });
});

describe("serializeMethodsMarkdown", () => {
    const methodsData: MethodsPageData = {
        methods: [
            {
                sectionName: "Unmet need",
                shortText: "Short description of unmet need.",
                text: "Long description with **markdown** details.",
            },
            {
                sectionName: "Financial hardship",
                shortText: "Short hardship text.",
                text: "Long hardship text.",
            },
        ],
        generalContent: {} as MethodsPageData["generalContent"],
    };

    it("emits H1 and one H2 per method, using full `text` only (no shortText duplication)", () => {
        const body = serializeMethodsMarkdown(methodsData, "UHC Watch - Methods");
        expect(body.startsWith("# UHC Watch - Methods\n\n")).toBe(true);
        expect(body).toContain("## Unmet need\n\nLong description with **markdown** details.");
        expect(body).not.toContain("Short description of unmet need.");
        expect(body).toContain("## Financial hardship\n\nLong hardship text.");
    });

    it("falls back to shortText when text is empty", () => {
        const body = serializeMethodsMarkdown(
            {
                ...methodsData,
                methods: [{ sectionName: "Only short", shortText: "Short only.", text: "" }],
            },
            "UHC Watch - Methods"
        );
        expect(body).toContain("## Only short\n\nShort only.");
    });

    it("handles methods with empty text fields gracefully", () => {
        const body = serializeMethodsMarkdown(
            {
                ...methodsData,
                methods: [{ sectionName: "Only header", shortText: "", text: "" }],
            },
            "UHC Watch - Methods"
        );
        expect(body).toContain("## Only header");
    });

    it("contains no HTML chrome", () => {
        const body = serializeMethodsMarkdown(methodsData, "UHC Watch - Methods");
        assertNoChrome(body);
    });
});

describe("serializeAreaOverviewMarkdown", () => {
    const features: ReadonlyArray<AreaMarkerFeature> = [
        {
            properties: {
                name: "Spain",
                status: "Emerging",
                generalSummary: "Strong progress on financial protection.",
                homePageSummary: "",
            },
        },
        {
            properties: {
                name: "Albania",
                status: "VeryWeak",
                generalSummary: "Significant gaps in coverage.",
                homePageSummary: "",
            },
        },
    ];

    it("sorts areas alphabetically and emits status + summary per country", () => {
        const body = serializeAreaOverviewMarkdown(features, "UHC Watch - Area overview");
        expect(body.startsWith("# UHC Watch - Area overview\n\n")).toBe(true);
        const albaniaIdx = body.indexOf("## Albania");
        const spainIdx = body.indexOf("## Spain");
        expect(albaniaIdx).toBeGreaterThan(-1);
        expect(spainIdx).toBeGreaterThan(albaniaIdx);
        expect(body).toContain("- Status: Very weak");
        expect(body).toContain("- Status: Emerging");
        expect(body).not.toContain("Coordinates:");
        expect(body).toContain("Significant gaps in coverage.");
        expect(body).toContain("Strong progress on financial protection.");
    });

    it("skips countries with empty summaries", () => {
        const body = serializeAreaOverviewMarkdown(
            [
                ...features,
                {
                    properties: {
                        name: "Atlantis",
                        status: "InsufficientData",
                        generalSummary: "   ",
                        homePageSummary: "   ",
                    },
                },
            ],
            "UHC Watch - Area overview"
        );
        expect(body).not.toContain("## Atlantis");
    });

    it("emits a fallback message when there are no markers", () => {
        const body = serializeAreaOverviewMarkdown([], "UHC Watch - Area overview");
        expect(body).toContain("No area data available.");
    });

    it("contains no HTML chrome", () => {
        const body = serializeAreaOverviewMarkdown(features, "UHC Watch - Area overview");
        assertNoChrome(body);
    });
});

describe("serializeLlmsTxt", () => {
    const input = {
        title: "UHC Watch",
        summary: "Monitors progress toward UHC in Europe and Central Asia.",
        pages: [
            { href: "/index.md", title: "UHC Watch", description: "Home" },
            { href: "/about.md", title: "UHC Watch - About", description: "About the team" },
            { href: "/methods.md", title: "UHC Watch - Methods", description: "Methodology" },
        ],
        externalResources: [
            { href: "https://example.org/abbr", label: "Abbreviations" },
            { href: "https://example.org/gloss", label: "Glossary" },
        ],
    };

    it("starts with the H1 title", () => {
        const body = serializeLlmsTxt(input);
        expect(body.startsWith("# UHC Watch\n")).toBe(true);
    });

    it("includes a blockquote summary directly after the H1", () => {
        const body = serializeLlmsTxt(input);
        const lines = body.split("\n");
        expect(lines[0]).toBe("# UHC Watch");
        expect(lines[2]).toBe("> Monitors progress toward UHC in Europe and Central Asia.");
    });

    it("lists each page as a markdown link under ## Pages", () => {
        const body = serializeLlmsTxt(input);
        expect(body).toContain("## Pages");
        expect(body).toContain("- [UHC Watch](/index.md): Home");
        expect(body).toContain("- [UHC Watch - About](/about.md): About the team");
        expect(body).toContain("- [UHC Watch - Methods](/methods.md): Methodology");
    });

    it("lists external resources under ## Optional without descriptions when omitted", () => {
        const body = serializeLlmsTxt(input);
        expect(body).toContain("## Optional");
        expect(body).toContain("- [Abbreviations](https://example.org/abbr)\n");
        expect(body).toContain("- [Glossary](https://example.org/gloss)\n");
        expect(body).not.toContain("External glossary resource");
    });

    it("renders external resource description when provided", () => {
        const body = serializeLlmsTxt({
            ...input,
            externalResources: [{ href: "https://example.org/x", label: "Extra", description: "With description" }],
        });
        expect(body).toContain("- [Extra](https://example.org/x): With description");
    });

    it("omits the Optional section when no external resources are given", () => {
        const body = serializeLlmsTxt({ ...input, externalResources: [] });
        expect(body).not.toContain("## Optional");
    });

    it("contains no HTML chrome", () => {
        const body = serializeLlmsTxt(input);
        assertNoChrome(body);
    });
});
