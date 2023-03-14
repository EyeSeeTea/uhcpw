import { ResourcesState, TeamMember } from "./AboutState";

export function useAbout(): ResourcesState {
    return {
        team: teamMembers,
    };
}

const teamMembers: TeamMember[] = [
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
