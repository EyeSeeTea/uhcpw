import { D2Api } from "@shared/types/d2-api";
import { Instance } from "@shared/data/entities/Instance";
import { getCompositionRoot } from "@shared/CompositionRoot";
import { createLogger, startTimer } from "@/lib/logger";

const log = createLogger("composition-root");

type CompositionRoot = ReturnType<typeof getCompositionRoot>;

let cachedApi: D2Api | undefined;
let cachedRoot: CompositionRoot | undefined;

function stripQuotes(s: string): string {
    return s.replace(/^['"]|['"]$/g, "");
}

function init(): { api: D2Api; compositionRoot: CompositionRoot } {
    if (cachedApi && cachedRoot) return { api: cachedApi, compositionRoot: cachedRoot };

    const endTimer = startTimer(log, "Composition root initialization");

    const baseUrl = stripQuotes(import.meta.env.DHIS2_BASE_URL ?? "");
    const auth = stripQuotes(import.meta.env.DHIS2_AUTH ?? "");

    const missing = [!baseUrl && "DHIS2_BASE_URL", !auth && "DHIS2_AUTH"].filter(Boolean);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    const [username, password] = auth.split(":");
    if (!username || !password) {
        throw new Error("DHIS2_AUTH must be in 'user:password' format");
    }

    const instance = new Instance({ url: baseUrl, username, password });
    cachedApi = new D2Api({ baseUrl, auth: { username, password }, backend: "xhr" });
    // d2DataEngine is only used by the React SPA runtime, not needed for SSG builds
    cachedRoot = getCompositionRoot(cachedApi, null as Parameters<typeof getCompositionRoot>[1], instance);

    endTimer();

    return { api: cachedApi, compositionRoot: cachedRoot };
}

export function getServerCompositionRoot(): CompositionRoot {
    return init().compositionRoot;
}

export function getServerD2Api(): D2Api {
    return init().api;
}
