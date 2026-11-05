import { getGeneralContent } from "@/data/general-content";
import { buildCache } from "@/lib/build-cache";
import type { Method } from "@shared/domain/entities/Method";
import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import { getServerCompositionRoot } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";

export type MethodsPageData = {
    methods: ReadonlyArray<Method>;
    generalContent: GeneralContent;
};

export const getMethodsPageData = buildCache(async (): Promise<MethodsPageData> => {
    const compositionRoot = getServerCompositionRoot();

    const [methods, generalContent] = await Promise.all([
        runFuture(compositionRoot.method.get.execute(), "methods.get"),
        getGeneralContent(),
    ]);

    return { methods, generalContent };
});
