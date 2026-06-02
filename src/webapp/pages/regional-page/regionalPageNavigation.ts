import type { RegionalMenuItem } from "./useRegionalPage";

const regionalMenuNavigationItems: Array<{
    item: RegionalMenuItem;
    hash: string;
    tab?: number;
}> = [
    { item: "regionMap", hash: "the-region-at-a-glance" },
    { item: "numbers", hash: "numbers", tab: 0 },
    { item: "gapsInCoverage", hash: "gaps-in-coverage", tab: 1 },
    { item: "policyChecklist", hash: "policy-checklist", tab: 2 },
    { item: "resources", hash: "resources", tab: 3 },
    { item: "experts", hash: "experts", tab: 4 },
];

export function getRegionalMenuItemFromHash(hash: string): RegionalMenuItem | undefined {
    const normalizedHash = hash.toLowerCase().replace(/^#/, "");

    return regionalMenuNavigationItems.find(item => item.hash === normalizedHash)?.item;
}

export function getRegionalMenuItemFromTab(tabId: number): RegionalMenuItem | undefined {
    return regionalMenuNavigationItems.find(item => item.tab === tabId)?.item;
}

export function getHashFromRegionalMenuItem(item: RegionalMenuItem): string {
    return regionalMenuNavigationItems.find(navigationItem => navigationItem.item === item)?.hash || "";
}
