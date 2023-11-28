import { FutureData } from "../entities/Future";
import { Method } from "../entities/Method";

export interface MethodRepository {
    get(): FutureData<Method[]>;
}
