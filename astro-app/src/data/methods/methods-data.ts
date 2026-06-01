import type { Method } from "@shared/domain/entities/Method";
import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import { getServerCompositionRoot } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";

export type MethodsPageData = {
    methods: ReadonlyArray<Method>;
    generalContent: GeneralContent;
};

export async function getMethodsPageData(): Promise<MethodsPageData> {
    const compositionRoot = getServerCompositionRoot();

    const [methods, generalContent] = await Promise.all([
        runFuture(compositionRoot.method.get.execute(), "methods.get"),
        runFuture(compositionRoot.general.getContent.execute(), "generalContent.get"),
    ]);

    return { methods, generalContent };
}
