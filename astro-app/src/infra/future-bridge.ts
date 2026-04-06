import type { FutureData } from "@shared/domain/entities/Future";

export function runFuture<T>(future: FutureData<T>): Promise<T> {
    return future.toPromise();
}
