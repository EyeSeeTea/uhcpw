export const AVATAR_FALLBACK = "/images/avatar-empty.png";

import type { Person } from "@shared/domain/entities/Person";
import type { Country } from "@shared/domain/entities/Country";
import type { OfficeInfo } from "@shared/domain/entities/about/OfficeInfo";
import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import { KOSOVO, SORTED_COUNTRY_GROUPINGS } from "@shared/data/repositories/countries/CountryD2Repository";
import { getServerCompositionRoot, getServerD2Api } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";
import { createLogger, startTimer } from "@/lib/logger";
import { downloadAboutPersonImages, downloadOfficeImage, type OfficeImageResult } from "./about-images";

const log = createLogger("about-data");

/** Locally-defined TreeOption to avoid pulling MUI deps at build time. */
export type TreeOption = {
    id: string;
    name: string;
    code?: string;
    parents: { id: string; name: string }[];
    children?: TreeOption[];
    isLeaf?: boolean;
};

export type PersonState = Readonly<
    Person & {
        countryName: string;
    }
>;

export const ALL_NODE_ID = "all";

export function mapPersonsWithCountry(
    persons: ReadonlyArray<Person>,
    countries: ReadonlyArray<Country>
): ReadonlyArray<PersonState> {
    const countryById = new Map(countries.map(c => [c.id, c.name]));

    return persons.map(person => ({
        ...person,
        countryName: (person.countryId && countryById.get(person.countryId)) ?? "",
    }));
}

export function sortTeam(team: ReadonlyArray<PersonState>): ReadonlyArray<PersonState> {
    return [...team].sort((a, b) => a.firstName.localeCompare(b.firstName));
}

export function sortExperts(experts: ReadonlyArray<PersonState>): ReadonlyArray<PersonState> {
    return [...experts].sort((a, b) => {
        const aIsKosovo = a.countryId === KOSOVO ? 1 : 0;
        const bIsKosovo = b.countryId === KOSOVO ? 1 : 0;
        if (aIsKosovo !== bIsKosovo) return aIsKosovo - bIsKosovo;

        const countryCompare = a.countryName.localeCompare(b.countryName);
        if (countryCompare !== 0) return countryCompare;

        return a.firstName.localeCompare(b.firstName);
    });
}

export function buildCountryTreeOptions(countries: ReadonlyArray<Country>): ReadonlyArray<TreeOption> {
    return countries.map(country => ({
        id: country.id,
        name: country.name,
        code: country.code,
        parents: [
            { id: ALL_NODE_ID, name: "All countries and areas" },
            ...country.parents
                .filter(parent => !parent.name.includes("income"))
                .map(g => ({
                    id: `parent-${g.id}`,
                    name: g.name,
                })),
        ],
    }));
}

export function buildParentSortOrder(): ReadonlyArray<string> {
    return [ALL_NODE_ID, ...SORTED_COUNTRY_GROUPINGS.map(g => `parent-${g}`)];
}

export type AboutPageData = {
    team: ReadonlyArray<PersonState>;
    experts: ReadonlyArray<PersonState>;
    officeInfo: OfficeInfo;
    officeImage: OfficeImageResult;
    countryTreeOptions: ReadonlyArray<TreeOption>;
    parentSortOrder: ReadonlyArray<string>;
    generalContent: GeneralContent;
};

export async function getAboutPageData(): Promise<AboutPageData> {
    const endTimer = startTimer(log, "About page data load");
    const compositionRoot = getServerCompositionRoot();

    const [teamRaw, expertsRaw, officeInfo, countries, generalContent] = await Promise.all([
        runFuture(compositionRoot.about.getPersons.execute(true), "about.getTeam"),
        runFuture(compositionRoot.about.getPersons.execute(false), "about.getExperts"),
        runFuture(compositionRoot.about.getOfficeInfo.execute(), "about.getOfficeInfo"),
        runFuture(compositionRoot.countries.get.execute(), "countries.get"),
        runFuture(compositionRoot.general.getContent.execute(), "generalContent.get"),
    ]);

    const team = sortTeam(mapPersonsWithCountry(teamRaw, countries));
    const experts = sortExperts(mapPersonsWithCountry(expertsRaw, countries));
    const countryTreeOptions = buildCountryTreeOptions(countries);
    const parentSortOrder = buildParentSortOrder();

    const api = getServerD2Api();
    const [{ persons: teamWithImages }, { persons: expertsWithImages }, officeImage] =
        await Promise.all([
            downloadAboutPersonImages(api, team),
            downloadAboutPersonImages(api, experts),
            downloadOfficeImage(api, officeInfo),
        ]);

    endTimer();

    return {
        team: teamWithImages,
        experts: expertsWithImages,
        officeInfo,
        officeImage,
        countryTreeOptions,
        parentSortOrder,
        generalContent,
    };
}
