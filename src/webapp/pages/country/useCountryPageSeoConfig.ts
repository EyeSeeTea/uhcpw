import React from "react";
import { Country } from "../../../domain/entities/Country";
import { SeoConfig } from "../../../domain/entities/SeoConfig";

export function useCountryPageSeoConfig(country?: Country): Partial<SeoConfig> | undefined {
    return React.useMemo(
        () =>
            country
                ? {
                      title: `UHC Watch - ${country.name}`,
                      description: `UHC Watch shows the health system factors and policies that strengthen and undermine financial protection in ${country.name}`,
                  }
                : undefined,
        [country]
    );
}
