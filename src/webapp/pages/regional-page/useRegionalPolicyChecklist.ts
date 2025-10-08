import { useCallback, useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { Future } from "../../../domain/entities/Future";
import { ChecklistPolicyMakersData } from "../../../domain/entities/region/ChecklistPolicyMakers";
import { Maybe } from "../../../types/utils";
import { CountryExperience } from "../../../domain/entities/region/CountryExperience";
import { Country } from "../../../domain/entities/Country";

export type CountryExperienceData = CountryExperience & {
    countryName: string;
};

export type RegionalPolicyChecklistState = {
    checklist: Maybe<ChecklistPolicyMakersData[]>;
    filteredCountryExperiences: Maybe<CountryExperienceData[]>;
    selectedChecklistItem: Id | undefined;
    onSelectChecklistItem: (id: Id | undefined) => void;
    isLoading: boolean;
};

export function useRegionalPolicyChecklist(): RegionalPolicyChecklistState {
    const { compositionRoot, countries } = useAppContext();
    const [checklist, setChecklist] = useState<ChecklistPolicyMakersData[] | undefined>(undefined);
    const [countryExperiences, setCountryExperiences] = useState<CountryExperienceData[] | undefined>(undefined);
    const [selectedChecklistItem, setSelectedChecklistItem] = useState<Id | undefined>(undefined);
    const [filteredCountryExperiences, setFilteredCountryExperiences] = useState<CountryExperienceData[] | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        Future.joinObj({
            countryExperiences: compositionRoot.regions.getCountryExperiences.execute(),
            checklistPolicyMakers: compositionRoot.regions.getChecklistPolicyMakers.execute(),
        }).run(
            ({ countryExperiences, checklistPolicyMakers }) => {
                setIsLoading(false);
                setChecklist(checklistPolicyMakers.checklist);
                const countryExperiencesData = countryExperiences.map(ce => buildCountryExperienceData(ce, countries));
                setCountryExperiences(countryExperiencesData);
            },
            error => {
                setChecklist(undefined);
                setCountryExperiences(undefined);
                console.error(error);
                setIsLoading(false);
            }
        );
    }, [compositionRoot.regions.getChecklistPolicyMakers, compositionRoot.regions.getCountryExperiences, countries]);

    const onSelectChecklistItem = useCallback(
        (id: Id | undefined) => {
            setSelectedChecklistItem(id);
            if (id && countryExperiences) {
                const countryExperiencesRelated = countryExperiences.filter(ce =>
                    ce.relatedPolicyChecklistIds.includes(id)
                );
                setFilteredCountryExperiences(countryExperiencesRelated);
            } else {
                setFilteredCountryExperiences(undefined);
            }
        },
        [countryExperiences]
    );

    return {
        checklist: checklist,
        onSelectChecklistItem: onSelectChecklistItem,
        selectedChecklistItem: selectedChecklistItem,
        filteredCountryExperiences: filteredCountryExperiences,
        isLoading: isLoading,
    };
}

function buildCountryExperienceData(countryExperience: CountryExperience, countries: Country[]): CountryExperienceData {
    const country = countries.find(c => c.id === countryExperience.countryId);
    return {
        ...countryExperience,
        countryName: country ? country.name : "Unknown country",
    };
}
