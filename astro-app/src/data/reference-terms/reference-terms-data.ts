import type { Abbreviations, GlossaryEntry } from "@shared/domain/entities/ReferenceTerms";
import { getServerCompositionRoot } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";

export function getGlossaryPageData(): Promise<GlossaryEntry[]> {
    return runFuture(getServerCompositionRoot().referenceTerms.getGlossary.execute(), "glossary.get");
}

export function getAbbreviationsPageData(): Promise<Abbreviations> {
    return runFuture(getServerCompositionRoot().referenceTerms.getAbbreviations.execute(), "abbreviations.get");
}
