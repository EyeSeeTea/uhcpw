import i18n from "@eyeseetea/feedback-component/locales";
import { useCallback, useState } from "react";
import { ResourcesState, Person } from "./AboutState";
import { useCountryOptions } from "../../common/hooks/countries/useCountryOptions";

export function useAbout(): ResourcesState {
    const { countryOptions, selectedCountry, onCountryChange } = useCountryOptions();

    const [selectedFilter, setSelectedFilter] = useState<string>(allFilter);
    const [experts, setExperts] = useState<Person[]>(expertsMembers);

    const onFilterChange = useCallback(
        (value: string) => {
            setSelectedFilter(value);
            setExperts(filterExperts(selectedCountry, value));
        },
        [selectedCountry]
    );

    return {
        team: teamMembers,
        experts,
        selectCountries: countryOptions,
        selectedCountry,
        onCountryChange,
        filters,
        selectedFilter,
        onFilterChange,
    };
}

const filterExperts = (countryCode: string | undefined, letterFilter: string) => {
    return expertsMembers.filter(
        expert =>
            (!countryCode || expert.countryCode === countryCode) &&
            (letterFilter === allFilter || expert.lastName.toLowerCase().startsWith(letterFilter.toLowerCase()))
    );
};

const teamMembers: Person[] = [
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

const expertsMembers: Person[] = [
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
