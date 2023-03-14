import { ResourcesState, Person } from "./AboutState";

export function useAbout(): ResourcesState {
    return {
        team: teamMembers,
        experts: expertsMembers,
    };
}

const teamMembers: Person[] = [
    {
        name: "Persona 1 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        name: "Persona 2 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        name: "Persona 3 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        name: "Persona 4 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
    {
        name: "Persona 5 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
    },
];

const expertsMembers: Person[] = [
    {
        name: "Persona 1 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        country: "Spain",
    },
    {
        name: "Persona 2 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        country: "Ireland",
    },
    {
        name: "Persona 3 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        country: "Spain",
    },
    {
        name: "Persona 4 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        country: "Ireland",
    },
    {
        name: "Persona 5 Apellido Apellido",
        image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        position: "Position ABC",
        linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
        email: "hello@eyeseetea.com",
        twitter: "https://twitter.com/EyeSeeTeaLtd",
        country: "Ireland",
    },
];
