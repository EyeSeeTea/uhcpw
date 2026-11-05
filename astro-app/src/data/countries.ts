import { getServerCompositionRoot } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";
import { buildCache } from "@/lib/build-cache";

export const getCountries = buildCache(() =>
    runFuture(getServerCompositionRoot().countries.get.execute(), "countries.get"),
);
