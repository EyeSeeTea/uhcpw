import { getCountries } from "@/data/countries";
import type { Country } from "@shared/domain/entities/Country";
import type { Region } from "@shared/domain/entities/region/Region";
import { ORG_UNIT_GROUP_IDS } from "@shared/domain/entities/region/Region";
import { KOSOVO } from "@shared/data/repositories/countries/CountryD2Repository";
import { formatCountryOrRegionParamName } from "@shared/webapp/utils/formatCountryOrRegionParamName";
import { getServerCompositionRoot } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";

export interface NavItem {
    readonly label: string;
    readonly href: string;
    readonly children?: readonly { readonly label: string; readonly href: string }[];
}

const REGIONS_ORDER: readonly string[] = [
    ORG_UNIT_GROUP_IDS.EUROPEAN_UNION,
    ORG_UNIT_GROUP_IDS.WESTERN_BALKANS,
    ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA,
    ORG_UNIT_GROUP_IDS.EUROPEAN_REGION,
];

function buildCountryNavItems(countries: ReadonlyArray<Country>): readonly { label: string; href: string }[] {
    const subregions = countries.flatMap(c => (c.children ? c.children : []));
    const all = [...countries, ...subregions];

    return all
        .filter(c => c.isInCountryPage)
        .sort((a, b) => {
            if (a.id === KOSOVO) return 1;
            if (b.id === KOSOVO) return -1;
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        })
        .map(c => ({
            label: c.name,
            href: `/${formatCountryOrRegionParamName(c.name)}`,
        }));
}

function buildRegionNavItems(regions: ReadonlyArray<Region>): readonly { label: string; href: string }[] {
    return [...regions]
        .filter(r => r.isInRegionalPage)
        .sort((a, b) => REGIONS_ORDER.indexOf(a.id) - REGIONS_ORDER.indexOf(b.id))
        .map(r => {
            const label = `${r.name} (${r.code})`;
            return {
                label,
                href: `/${formatCountryOrRegionParamName(label)}`,
            };
        });
}

let cached: Promise<readonly NavItem[]> | undefined;

export function getNavItems(): Promise<readonly NavItem[]> {
    if (!cached) {
        cached = fetchNavItems();
    }
    return cached;
}

async function fetchNavItems(): Promise<readonly NavItem[]> {
    const compositionRoot = getServerCompositionRoot();

    const [countries, regions] = await Promise.all([
        getCountries(),
        runFuture(compositionRoot.regions.get.execute(), "regions.get"),
    ]);

    const countryChildren = buildCountryNavItems(countries);
    const regionChildren = buildRegionNavItems(regions);

    return [
        { label: "Indicator explorer", href: "/indicator-explorer" },
        { label: "Policy explorer", href: "/policy-explorer" },
        { label: "Regional overview", href: "/regional-overview", children: regionChildren },
        { label: "Countries & areas", href: "/countries", children: countryChildren },
        { label: "Methods", href: "/methods" },
        { label: "Resources", href: "/resources" },
        { label: "About us", href: "/about" },
    ];
}
