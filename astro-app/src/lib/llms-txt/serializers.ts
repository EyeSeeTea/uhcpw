import type { FinancialProtectionStatus } from "@shared/domain/entities/FinancialProtectionStatus";
import type { AboutPageData, PersonState } from "@/data/about/about-data";
import type { MethodsPageData } from "@/data/methods/methods-data";

export type LlmsTxtPageEntry = Readonly<{
    href: string;
    title: string;
    description: string;
}>;

export type LlmsTxtExternalResource = Readonly<{
    href: string;
    label: string;
    description?: string;
}>;

export type LlmsTxtInput = Readonly<{
    title: string;
    summary: string;
    pages: ReadonlyArray<LlmsTxtPageEntry>;
    externalResources: ReadonlyArray<LlmsTxtExternalResource>;
}>;

export type AreaMarkerFeature = Readonly<{
    properties: Readonly<{
        name: string;
        status: FinancialProtectionStatus;
        generalSummary: string;
        homePageSummary: string;
    }>;
}>;

export function serializeHomeMarkdown(summary: string, title: string): string {
    return `# ${title}\n\n${summary.trim()}\n`;
}

export function serializeAboutMarkdown(data: AboutPageData, title: string): string {
    const body = data.officeInfo.officeText.trim();
    const teamSection = renderPersonSection("Team", data.team, { includeCountry: false });
    const expertsSection = renderPersonSection("Experts", data.experts, { includeCountry: true });
    const sections = [`# ${title}`, body, teamSection, expertsSection].filter(s => s.length > 0);
    return `${sections.join("\n\n")}\n`;
}

export function serializeMethodsMarkdown(data: MethodsPageData, title: string): string {
    const methodSections = data.methods.map(method => {
        const full = method.text.trim() || method.shortText.trim();
        const parts = [`## ${method.sectionName}`, full].filter(part => part.length > 0);
        return parts.join("\n\n");
    });
    const sections = [`# ${title}`, ...methodSections];
    return `${sections.join("\n\n")}\n`;
}

export function serializeAreaOverviewMarkdown(features: ReadonlyArray<AreaMarkerFeature>, title: string): string {
    const areaSections = features
        .map(f => ({
            ...f,
            summary: [f.properties.generalSummary, f.properties.homePageSummary]
                .map(s => s.trim())
                .filter(s => s.length > 0)
                .join("\n\n"),
        }))
        .filter(f => f.summary.length > 0)
        .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
        .map(feature => {
            const { name, status } = feature.properties;
            return [`## ${name}`, `- Status: ${STATUS_LABELS[status]}`, feature.summary].join("\n\n");
        });
    const intro =
        areaSections.length === 0
            ? "No area data available."
            : "This page lists every country and area with a UHC Watch map marker, including its financial-protection status and one-line summary.";
    return `${[`# ${title}`, intro, ...areaSections].join("\n\n")}\n`;
}

export function serializeLlmsTxt(input: LlmsTxtInput): string {
    const pageLines = input.pages.map(page => `- [${page.title}](${page.href}): ${page.description}`);
    const optionalLines = input.externalResources.map(resource => {
        const suffix = resource.description ? `: ${resource.description}` : "";
        return `- [${resource.label}](${resource.href})${suffix}`;
    });

    const sections = [
        `# ${input.title}`,
        `> ${input.summary.trim()}`,
        "## Pages",
        pageLines.join("\n"),
        ...(optionalLines.length > 0 ? ["## Optional", optionalLines.join("\n")] : []),
    ];

    return `${sections.join("\n\n")}\n`;
}

function renderPersonSection(
    heading: string,
    people: ReadonlyArray<PersonState>,
    options: { includeCountry: boolean }
): string {
    if (people.length === 0) return "";
    const bullets = people.map(person => {
        const fullName = `${person.firstName} ${person.lastName}`.trim();
        const role = person.position.trim();
        const country = options.includeCountry ? person.countryName.trim() : "";
        const suffix = [role, country].filter(p => p.length > 0).join(", ");
        return suffix.length > 0 ? `- ${fullName} - ${suffix}` : `- ${fullName}`;
    });
    return `## ${heading}\n\n${bullets.join("\n")}`;
}

const STATUS_LABELS: Record<FinancialProtectionStatus, string> = {
    Strong: "Strong",
    Emerging: "Emerging",
    Gaps: "Gaps",
    Weak: "Weak",
    VeryWeak: "Very weak",
    InsufficientData: "Insufficient data",
};
