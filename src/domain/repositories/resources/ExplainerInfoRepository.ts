import { FutureData } from "../../entities/Future";
import { ExplainerInfo } from "../../entities/resources/ExplainerInfo";

export interface ExplainerInfoRepository {
    get(): FutureData<ExplainerInfo>;
}
