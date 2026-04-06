export interface NavItem {
    readonly label: string;
    readonly href: string;
    readonly children?: readonly { readonly label: string; readonly href: string }[];
}

const regions = [
    { label: "European Union (EU)", href: "/regional-overview/eu" },
    { label: "Western Balkans (WB)", href: "/regional-overview/wb" },
    { label: "Eastern Europe & Central Asia (EECA)", href: "/regional-overview/eeca" },
    { label: "European Region (ER)", href: "/regional-overview/er" },
];

const countries = [
    { label: "Albania", href: "/countries/albania" },
    { label: "Belgium", href: "/countries/belgium" },
    { label: "BIH (the Federation of Bosnia and Herzegovina)", href: "/countries/bih-federation" },
    { label: "BIH (the Republika Srpska)", href: "/countries/bih-republika-srpska" },
    { label: "Bulgaria", href: "/countries/bulgaria" },
    { label: "Croatia", href: "/countries/croatia" },
    { label: "Estonia", href: "/countries/estonia" },
    { label: "Georgia", href: "/countries/georgia" },
    { label: "Kyrgyzstan", href: "/countries/kyrgyzstan" },
    { label: "Monaco", href: "/countries/monaco" },
    { label: "Montenegro", href: "/countries/montenegro" },
    { label: "North Macedonia", href: "/countries/north-macedonia" },
    { label: "Republic of Moldova", href: "/countries/moldova" },
    { label: "Romania", href: "/countries/romania" },
    { label: "Spain", href: "/countries/spain" },
    { label: "Tajikistan", href: "/countries/tajikistan" },
    { label: "Ukraine", href: "/countries/ukraine" },
    { label: "Kosovo*", href: "/countries/kosovo" },
];

export const navItems: readonly NavItem[] = [
    { label: "Indicator explorer", href: "/indicator-explorer" },
    { label: "Policy explorer", href: "/policy-explorer" },
    { label: "Regional overview", href: "/regional-overview", children: regions },
    { label: "Countries & areas", href: "/countries", children: countries },
    { label: "Methods", href: "/methods" },
    { label: "Resources", href: "/resources" },
    { label: "About us", href: "/about" },
];
