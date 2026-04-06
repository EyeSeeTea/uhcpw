import type { Person } from "@shared/domain/entities/Person";

const IMAGE_VALIDATION_TIMEOUT_MS = 5000;

function getAuthHeaders(): Record<string, string> {
    const auth = import.meta.env.DHIS2_AUTH;
    if (!auth) return {};
    return { Authorization: `Basic ${Buffer.from(auth).toString("base64")}` };
}

export async function validateImageUrl(url: string): Promise<boolean> {
    if (!url || url.includes("avatar-empty")) return false;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), IMAGE_VALIDATION_TIMEOUT_MS);

        const response = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
            headers: getAuthHeaders(),
        });

        clearTimeout(timeout);
        return response.ok;
    } catch {
        return false;
    }
}

export async function validatePersonImages(
    persons: ReadonlyArray<Person>
): Promise<Map<string, boolean>> {
    const uniqueUrls = [...new Set(persons.map(p => p.image))];

    const results = await Promise.allSettled(
        uniqueUrls.map(async url => ({ image: url, valid: await validateImageUrl(url) }))
    );

    return new Map(
        results
            .filter(
                (r): r is PromiseFulfilledResult<{ image: string; valid: boolean }> =>
                    r.status === "fulfilled"
            )
            .map(r => [r.value.image, r.value.valid])
    );
}
