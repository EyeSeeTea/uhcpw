import pino from "pino";

export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    transport:
        process.env.LOG_PRETTY === "true"
            ? { target: "pino-pretty", options: { colorize: true } }
            : undefined,
});

export function createLogger(name: string) {
    return logger.child({ module: name });
}

export function startTimer(log: pino.Logger, message: string) {
    const start = performance.now();
    return () => {
        const ms = (performance.now() - start).toFixed(1);
        log.info({ durationMs: ms }, `${message} completed`);
    };
}
