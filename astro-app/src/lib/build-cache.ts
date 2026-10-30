/** Reuse in-flight and successful work during a static build, but not in dev. */
export function buildCache<T>(load: () => Promise<T>, enabled = import.meta.env.PROD): () => Promise<T> {
    let cached: Promise<T> | undefined;
    return () => {
        if (!enabled) return load();
        if (!cached) {
            cached = Promise.resolve().then(load).catch(error => {
                cached = undefined;
                throw error;
            });
        }
        return cached;
    };
}
