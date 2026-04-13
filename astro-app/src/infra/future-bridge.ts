import type { FutureData } from "@shared/domain/entities/Future";
import { createLogger } from "@/lib/logger";

const log = createLogger("future-bridge");

export function runFuture<T>(future: FutureData<T>, label?: string): Promise<T> {
    const tag = label ?? "unknown";
    log.debug({ operation: tag }, "Fetching…");
    const start = performance.now();

    return future.toPromise().then(
        result => {
            const durationMs = (performance.now() - start).toFixed(1);
            log.info({ operation: tag, durationMs }, "Fetched");
            return result;
        },
        error => {
            const durationMs = (performance.now() - start).toFixed(1);
            log.error({ operation: tag, durationMs, error }, "Fetch failed");
            throw error;
        },
    );
}
