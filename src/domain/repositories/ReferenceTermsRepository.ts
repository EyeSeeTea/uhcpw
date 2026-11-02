import { FutureData } from "../entities/Future";
import { Abbreviations, GlossaryEntries } from "../entities/ReferenceTerms";

export interface ReferenceTermsRepository {
    getGlossary(): FutureData<GlossaryEntries>;
    getAbbreviations(): FutureData<Abbreviations>;
}
