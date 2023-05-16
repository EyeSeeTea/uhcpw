import { Future, FutureData } from "../../domain/entities/Future";
import { Person } from "../../domain/entities/Person";
import { OfficeTeamRepository } from "../../domain/repositories/OfficeTeamRepository";

export class OfficeTeamInMemoryRepository implements OfficeTeamRepository {
    //private api: D2Api;

    constructor() {
        //  this.api = getD2APiFromInstance(instance);
    }
    get(): FutureData<Person[]> {
        return Future.success(teamMembers);
    }
}

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
