import { useCallback, useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { Future } from "../../../domain/entities/Future";
import { ChecklistPolicyMakersData } from "../../../domain/entities/region/ChecklistPolicyMakers";
import { Maybe } from "../../../types/utils";
import { CountryExperience } from "../../../domain/entities/region/CountryExperience";
import { Country } from "../../../domain/entities/Country";

export type ChecklistPolicyMakersWithCountries = ChecklistPolicyMakersData & {
    countryExperiencesIds: Id[];
};

export type CountryExperienceData = CountryExperience & {
    countryName: string;
    disableGoToCountryPage: boolean;
};

export type RegionalPolicyChecklistState = {
    checklist: Maybe<ChecklistPolicyMakersWithCountries[]>;
    filteredCountryExperiences: Maybe<CountryExperienceData[]>;
    selectedChecklistItems: Id[] | undefined;
    onSelectChecklistItem: (id: Id) => void;
    onCleanSelection: () => void;
    isLoading: boolean;
};

export function useRegionalPolicyChecklist(): RegionalPolicyChecklistState {
    const { compositionRoot, countries } = useAppContext();
    const [checklist, setChecklist] = useState<ChecklistPolicyMakersWithCountries[] | undefined>(undefined);
    const [countryExperiences, setCountryExperiences] = useState<CountryExperienceData[] | undefined>(undefined);
    const [selectedChecklistItems, setSelectedChecklistItems] = useState<Id[] | undefined>(undefined);
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

                const checklist = checklistPolicyMakers.checklist.map(item =>
                    buildChecklistPolicyMakersWithCountries(item, countryExperiences)
                );
                setChecklist(checklist);

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
        (itemId: Id) => {
            const newSelection = selectedChecklistItems?.includes(itemId)
                ? selectedChecklistItems.filter(id => id !== itemId)
                : [...(selectedChecklistItems || []), itemId];

            setSelectedChecklistItems(newSelection);

            if (newSelection.length && countryExperiences) {
                const newFilteredCountryExperiences = countryExperiences.filter(ce =>
                    ce.relatedPolicyChecklistIds.some(id => newSelection.includes(id))
                );

                setFilteredCountryExperiences(
                    sortFilteredCountryExperiences(newFilteredCountryExperiences, checklist || [])
                );
            } else {
                setFilteredCountryExperiences(undefined);
            }
        },
        [checklist, countryExperiences, selectedChecklistItems]
    );

    const onCleanSelection = useCallback(() => {
        setSelectedChecklistItems(undefined);
        setFilteredCountryExperiences(undefined);
    }, []);

    return {
        checklist: checklist,
        onSelectChecklistItem: onSelectChecklistItem,
        selectedChecklistItems: selectedChecklistItems,
        filteredCountryExperiences: filteredCountryExperiences,
        onCleanSelection: onCleanSelection,
        isLoading: isLoading,
    };
}

function buildChecklistPolicyMakersWithCountries(
    checklistItem: ChecklistPolicyMakersData,
    countryExperiences: CountryExperience[]
): ChecklistPolicyMakersWithCountries {
    const relatedCountryExperiencesIds = countryExperiences
        .filter(ce => ce.relatedPolicyChecklistIds.includes(checklistItem.id))
        .map(ce => ce.countryId);

    return {
        ...checklistItem,
        countryExperiencesIds: relatedCountryExperiencesIds,
    };
}

function buildCountryExperienceData(countryExperience: CountryExperience, countries: Country[]): CountryExperienceData {
    const country = countries.find(c => c.id === countryExperience.countryId);

    return {
        ...countryExperience,
        disableGoToCountryPage: !country?.isInCountryPage,
        countryName: country ? country.name : "Unknown country",
    };
}

function sortFilteredCountryExperiences(
    countryExperiences: CountryExperienceData[],
    checklist: ChecklistPolicyMakersWithCountries[]
): CountryExperienceData[] {
    const orderMap: Record<string, number> = checklist.reduce((acc, item, index) => {
        return { ...acc, [item.id]: index };
    }, {});

    const getCountryOrder = (country: CountryExperienceData) => {
        const positions: number[] = country.relatedPolicyChecklistIds
            .map(id => orderMap[id])
            .filter((pos): pos is number => pos !== undefined);
        return positions.length ? Math.min(...positions) : Infinity;
    };

    return [...countryExperiences].sort((countryA, countryB) => getCountryOrder(countryA) - getCountryOrder(countryB));
}
