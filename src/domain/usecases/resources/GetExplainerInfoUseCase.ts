import { FutureData } from "../../entities/Future";
import { ExplainerInfo } from "../../entities/resources/ExplainerInfo";
import { ExplainerInfoRepository } from "../../repositories/resources/ExplainerInfoRepository";

export class GetExplainerInfoUseCase {
    constructor(private repository: ExplainerInfoRepository) {}

    public execute(): FutureData<ExplainerInfo> {
        return this.repository.get();
    }
}
