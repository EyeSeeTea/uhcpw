import { D2Api } from "@shared/types/d2-api";
import { Instance } from "@shared/data/entities/Instance";
import { getCompositionRoot } from "@shared/CompositionRoot";

type CompositionRoot = ReturnType<typeof getCompositionRoot>;

let cachedRoot: CompositionRoot | undefined;

export function getServerCompositionRoot(): CompositionRoot {
    if (cachedRoot) return cachedRoot;

    const baseUrl = import.meta.env.DHIS2_BASE_URL;
    const auth = import.meta.env.DHIS2_AUTH;

    const missing = [!baseUrl && "DHIS2_BASE_URL", !auth && "DHIS2_AUTH"].filter(Boolean);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    const [username, password] = auth.split(":");
    if (!username || !password) {
        throw new Error("DHIS2_AUTH must be in 'user:password' format");
    }

    const instance = new Instance({ url: baseUrl, username, password });
    const api = new D2Api({ baseUrl, auth: { username, password }, backend: "xhr" });

    cachedRoot = getCompositionRoot(api, null as unknown, instance);
    return cachedRoot;
}
