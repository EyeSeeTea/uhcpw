import { FutureData } from "../entities/Future";
import { Method } from "../entities/Method";
import { MethodRepository } from "../repositories/MethodRepository";

export class GetMethodsUseCase {
    constructor(private methodRepository: MethodRepository) {}

    public execute(): FutureData<Method[]> {
        return this.methodRepository.get();
    }
}
