import type { Abbreviations, GlossaryEntry } from "@shared/domain/entities/ReferenceTerms";
import { getServerCompositionRoot } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";
import { buildCache } from "@/lib/build-cache";

export const getGlossaryPageData = buildCache(
    (): Promise<GlossaryEntry[]> =>
        runFuture(getServerCompositionRoot().referenceTerms.getGlossary.execute(), "glossary.get")
);

export const getAbbreviationsPageData = buildCache(
    (): Promise<Abbreviations> =>
        runFuture(getServerCompositionRoot().referenceTerms.getAbbreviations.execute(), "abbreviations.get")
);
