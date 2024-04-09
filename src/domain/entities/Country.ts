export type Country = {
    id: string;
    name: string;
    longName: string;
    code: string;
    description: string;
    status: CountryStatus;
    coordinates: [number, number];
    parents: { id: string; name: string }[];
    flag: string;
    summary: string;
    sliderInfo: {
        gapsSection: CountrySectionInfo;
        finProtecSection: CountrySectionInfo;
    };
    isInCountryPage: boolean;
};

export type CountrySectionInfo = {
    sectionName: string;
    content: {
        title: string;
        text: string;
    }[];
};

export type CountryStatus = "Strong" | "Gaps" | "Weak";
