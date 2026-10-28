import React from "react";
import { Region } from "../../../domain/entities/region/Region";
import { SeoConfig } from "../../../domain/entities/SeoConfig";

export function useRegionalPageSeoConfig(region?: Region): Partial<SeoConfig> | undefined {
    return React.useMemo(
        () =>
            region
                ? {
                      title: `UHC Watch - ${region.name}: regional overview`,
                      description: `UHC Watch shows up-to-date information on health coverage policy, affordable access to health care in ${region.name}`,
                  }
                : undefined,
        [region]
    );
}
