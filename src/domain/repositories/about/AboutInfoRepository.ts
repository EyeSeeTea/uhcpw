import { FutureData } from "../../entities/Future";
import { OfficeInfo } from "../../entities/about/OfficeInfo";

export interface AboutInfoRepository {
    getOfficeInfo(): FutureData<OfficeInfo>;
}
