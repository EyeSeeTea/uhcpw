import { useCallback, useEffect, useState } from "react";
import { ResourcesState } from "./AboutState";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { CountryFilterState } from "../../common/state/state";
import i18n from "../../../locales";
import { Person } from "../../../domain/entities/Person";

export function useAbout(): ResourcesState {
    const countryFilter = useMultiCountryOptionsV2();

    const [selectedFilter, setSelectedFilter] = useState<string>(allFilter);
    const [experts, setExperts] = useState<Person[]>(expertsMembers);

    useEffect(() => {
        setExperts(filterExperts(countryFilter, selectedFilter));
    }, [countryFilter.selected, countryFilter.options]);

    const onFilterChange = useCallback(
        (value: string) => {
            setSelectedFilter(value);

            setExperts(filterExperts(countryFilter, value));
        },
        [countryFilter.selected, countryFilter.options]
    );

    return {
        team: teamMembers,
        experts,
        countryFilter,
        filters,
        selectedFilter,
        onFilterChange,
    };
}

const filterExperts = (countryFilter: CountryFilterState, letterFilter: string) => {
    const countryCodes = countryFilter.selected
        ? countryFilter.options
              .filter(country => countryFilter.selected?.includes(country.id))
              .map(({ code }) => code || "")
        : undefined;

    return expertsMembers.filter(
        expert =>
            (!countryCodes || countryCodes?.includes(expert.countryCode || "")) &&
            (letterFilter === allFilter || expert.firstName.toLowerCase().startsWith(letterFilter.toLowerCase()))
    );
};

export const teamMembers: Person[] = [
    {
        firstName: "first name 1",
        lastName: "last name 1",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        firstName: "first name 2",
        lastName: "last name 2",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        firstName: "first name 3",
        lastName: "last name 3",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        firstName: "first name 4",
        lastName: "last name 4",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        firstName: "first name 5",
        lastName: "last name 5",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        firstName: "first name 6",
        lastName: "last name 6",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
];

export const expertsMembers: Person[] = [
    {
        firstName: "first name 1",
        lastName: "last name 1",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        countryCode: "ESP",
        country: "Spain",
    },
    {
        firstName: "first name 2",
        lastName: "last name 2",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        countryCode: "IRL",
        country: "Ireland",
    },
    {
        firstName: "first name 3",
        lastName: "last name 3",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        countryCode: "ESP",
        country: "Spain",
    },
    {
        firstName: "first name 4",
        lastName: "last name 4",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        countryCode: "IRL",
        country: "Ireland",
    },
    {
        firstName: "first name 5",
        lastName: "last name 5",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        countryCode: "IRL",
        country: "Ireland",
    },
    {
        firstName: "first name 6",
        lastName: "last name 6",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        countryCode: "IRL",
        country: "Ireland",
    },
];

const allFilter = i18n.t("All");

const filters = [
    allFilter,
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];
