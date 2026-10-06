async function bootstrap() {
    if (import.meta.env.DEV && import.meta.env.MODE === "profiling") {
        const { initializeProfiling } = await import("./webapp/utils/wdyr");
        await initializeProfiling();
    }
    await import("./index");
}

bootstrap().catch(() => console.error("Failed to initialize UHC Watch"));
