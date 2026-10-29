import { FutureData } from "../entities/Future";
import { Abbreviations, GlossaryEntry } from "../entities/ReferenceTerms";

export interface ReferenceTermsRepository {
    getGlossary(): FutureData<GlossaryEntry[]>;
    getAbbreviations(): FutureData<Abbreviations>;
}
