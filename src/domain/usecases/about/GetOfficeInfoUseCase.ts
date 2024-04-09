import { FutureData } from "../../entities/Future";
import { OfficeInfo } from "../../entities/about/OfficeInfo";
import { AboutInfoRepository } from "../../repositories/about/AboutInfoRepository";

export class GetOfficeInfoUseCase {
    constructor(private aboutInfoRepository: AboutInfoRepository) {}

    public execute(): FutureData<OfficeInfo> {
        return this.aboutInfoRepository.getOfficeInfo();
    }
}
