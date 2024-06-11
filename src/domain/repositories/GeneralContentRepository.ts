import { FutureData } from "../entities/Future";
import { GeneralContent } from "../entities/GeneralContent";

export interface GeneralContentRepository {
    get(): FutureData<GeneralContent>;
}
