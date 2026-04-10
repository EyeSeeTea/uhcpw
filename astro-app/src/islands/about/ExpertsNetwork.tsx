import React, { useState, useMemo, useEffect } from "react";
import { PersonCardReact } from "./PersonCardReact";
import type { ExpertsNetworkSelectorProps } from "./ExpertsNetworkSelector";

import type { PersonState, TreeOption } from "@/data/about/about-data";

export interface ExpertsNetworkProps {
    experts: readonly PersonState[];
    countryOptions: readonly TreeOption[];
    parentSortOrder: readonly string[];
    title: string;
    subtitle: string;
}

type SelectorComponent = React.ComponentType<ExpertsNetworkSelectorProps>;

/**
 * SSR-safe experts network island.
 *
 * The title, subtitle and experts grid render on both server and client so the
 * static HTML emitted by `astro build` contains real content. The Material-UI
 * providers and `TreeSelector` live in `ExpertsNetworkSelector.tsx`, which is
 * loaded via dynamic `import()` only after mount — this keeps the legacy MUI v0
 * imports out of Astro's SSR module graph (they fail with ERR_UNSUPPORTED_DIR_IMPORT
 * during prerender).
 */
export const ExpertsNetwork: React.FC<ExpertsNetworkProps> = ({
    experts,
    countryOptions,
    parentSortOrder,
    title,
    subtitle,
}) => {
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [Selector, setSelector] = useState<SelectorComponent | null>(null);

    useEffect(() => {
        let cancelled = false;
        import("./ExpertsNetworkSelector")
            .then(mod => {
                if (!cancelled) {
                    // setState with a function would invoke the function as an updater;
                    // wrap in an arrow to store the component itself.
                    setSelector(() => mod.ExpertsNetworkSelector);
                }
            })
            .catch(error => {
                console.error("Failed to load ExpertsNetworkSelector chunk", error);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const parentSort = useMemo(
        () => (a: string, b: string) => parentSortOrder.indexOf(a) - parentSortOrder.indexOf(b),
        [parentSortOrder]
    );

    const filteredExperts = useMemo(() => {
        if (selectedCountries.length === 0) return experts;
        return experts.filter(expert => expert.countryId !== undefined && selectedCountries.includes(expert.countryId));
    }, [experts, selectedCountries]);

    return (
        <section>
            <div className="experts-title-container">
                <h2 className="experts-title">{title}</h2>
                <h3 className="experts-subtitle">{subtitle}</h3>
            </div>

            <div className="experts-selector-row">
                {Selector ? (
                    <Selector
                        countryOptions={countryOptions}
                        selectedCountries={selectedCountries}
                        onSelectedCountriesChange={setSelectedCountries}
                        parentSort={parentSort}
                    />
                ) : (
                    <div className="experts-selector-placeholder" aria-hidden="true" />
                )}
            </div>

            <div className="experts-grid" role="list" aria-label="Experts network">
                {filteredExperts.map((expert, index) => (
                    <PersonCardReact key={`${expert.firstName}-${expert.lastName}-${index}`} person={expert} />
                ))}
            </div>
        </section>
    );
};

ExpertsNetwork.displayName = "ExpertsNetwork";
