export type Country = {
    id: string;
    name: string;
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
};

export type CountrySectionInfo = {
    sectionName: string;
    content: {
        title: string;
        text: string;
    }[];
};

export type CountryStatus = "Strong" | "Gaps" | "Weak";
