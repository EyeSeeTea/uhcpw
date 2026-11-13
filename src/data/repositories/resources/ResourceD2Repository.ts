import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import {
    AnalysisResource,
    ComparativeAnalysis,
    CountryAnalysis,
    MediaResource,
    Multimedia,
    News,
    Resource,
} from "../../../domain/entities/resources/Resource";
import { ResourceFilters, ResourceRepository } from "../../../domain/repositories/resources/ResourceRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_GROUP_IDS } from "../../../domain/entities/region/Region";
import { getCountryId, KOSOVO } from "../countries/CountryD2Repository";

export const resourceDataElements = {
    comparativeAnalysisCategory: "BBKWdyuSwkT",
    newsCategory: "AGWJYBEy90o",
    multimediaCategory: "awlsQKOwDgB",
    countryAnalysisCategory: "jwmMKDQrxhD",
    theme: "TTAQLTta8JS",
    themeSecondary: "XmS4WVRTh29",
    imageOriginal: "uund7zjS1Yt",
    imageCustom: "UBAOd8omOog",
    title: "iBxOUseHUtO",
    link: "WlAFwnRMskp",
    linkLanguage: "yKHkUZLIGc6",
    link2: "nVhCDkoptRC",
    link2Language: "rovY1LEqAPX",
    link3: "egYRckQrYVj",
    link3Language: "DQAOcVPEQTh",
    link4: "yfKcdYARapH",
    link4Language: "QlRpFiResvs",
    relatedCountry1: "s4rejJAHkEj",
    relatedCountry2: "oQ6Qi6faNK5",
    relatedCountry3: "LpvSstI1qkv",
    relatedCountry4: "XqOzgOaLYIC",
    relatedCountry5: "W1rJkxxdsf7",
    relatedCountry6: "s9VZRkTRnok",
    relatedCountry7: "wR829irugl9",
    relatedCountry8: "x6PpqgIH0Rt",
    relatedCountry9: "wkH2AyYFqOc",
    relatedCountry10: "PF1BSn79hgT",
    relatedCountry11: "uc0QAtItg9A",
    relatedCountry12: "JypkjZAQmnM",
    relatedCountry13: "AlLQaVQtjDw",
    relatedCountry14: "Vc55KzffRaY",
    relatedCountry15: "txupFIjcJxc",
    relatedCountry16: "i51gDVomugt",
    relatedCountry17: "NrdV87QJt9S",
    relatedCountry18: "hbPjqVnjly5",
    relatedCountry19: "y74nWeCoAdH",
    relatedCountry20: "sqqJNJDwN1F",
    relatedCountry21: "QlBdXGOdz4x",
    relatedCountry22: "jc3d0ZSupHK",
    relatedCountry23: "Jh00i19RF91",
    relatedCountry24: "EJAYWps6wm0",
    relatedCountry25: "a61IrOb5leV",
    relatedCountry26: "BFFlxznLkZv",
    relatedCountry27: "vLdkDy58YqQ",
    relatedCountry28: "ffndxAozKG5",
    relatedCountry29: "tYbQcw47cQZ",
    relatedCountry30: "TVsjP1VoGsA",
    relatedCountry31: "ZEDLsKyJcib",
    relatedCountry32: "vJqqddnRCsW",
    relatedCountry33: "POJAv84qfrq",
    relatedCountry34: "HvuwOxCfiN4",
    relatedCountry35: "ZwP1hA1cpmK",
    relatedCountry36: "zxVo1DM7JnD",
    relatedCountry37: "mCH3sabJvqA",
    relatedCountry38: "yhFTBkdmwv0",
    relatedCountry39: "qQRNZQTY9VN",
    relatedCountry40: "Uyvm6flgZiw",
    relatedCountry41: "ILEnJeyeLoq",
    relatedCountry42: "xqIqiIeXTTn",
    relatedCountry43: "Z3dx2oHFuX0",
    relatedCountry44: "JznDPih1PSU",
    relatedCountry45: "n7TlGYb7dym",
    relatedCountry46: "QJT7OLzr03U",
    relatedCountry47: "ECnmaEiTUvR",
    relatedCountry48: "cU3KtOc1ITE",
    relatedCountry49: "HuEm6ea7BOF",
    relatedCountry50: "EHvTTWUmkol",
    relatedCountry51: "YxV0WQp3VAl",
    relatedCountry52: "DdN4ILfxL3C",
    relatedCountry53: "lNV1ALwvpIw",
    relatedCountry54: "XJwfD9RRdjD",
    relatedCountry55: "iT9uyIe9YzS",
    relatedCountry56: "WwRZaRKfWRd",
    relatedCountry57: "bxQaM4K8tNl",
    relatedCountry58: "CrBYPANirHP",
    relatedCountry59: "fol5rrUU53I",
    relatedCountry60: "rk5OFNGLSdK",
    countryGroup: "jO5gRGncehx",
} as const;

const relatedCountryDataElements: ReadonlyArray<Id> = Object.entries(resourceDataElements)
    .filter(([key]) => key.startsWith("relatedCountry"))
    .map(([, dataElement]) => dataElement);

/** Codes of the options of the country group data element */
const countryGroupCodes = ["ALL", "ER", "EU", "EECA", "WB", "EUCC"] as const;
type CountryGroupCode = typeof countryGroupCodes[number];

const orgUnitGroupByCountryGroup: Readonly<Record<CountryGroupCode, Id>> = {
    ALL: ORG_UNIT_GROUP_IDS.EUROPEAN_REGION,
    ER: ORG_UNIT_GROUP_IDS.EUROPEAN_REGION,
    EU: ORG_UNIT_GROUP_IDS.EUROPEAN_UNION,
    EECA: ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA,
    WB: ORG_UNIT_GROUP_IDS.WESTERN_BALKANS,
    EUCC: ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES,
};

/** Kosovo is in no org unit group, so "All countries" adds it to the European Region countries */
const extraCountriesByCountryGroup: Readonly<Partial<Record<CountryGroupCode, ReadonlyArray<Id>>>> = {
    ALL: [KOSOVO],
};

type CountriesByCountryGroup = ReadonlyMap<CountryGroupCode, ReadonlyArray<Id>>;

type CountriesFilter = Readonly<{
    countries: ReadonlyArray<Id>;
    countriesByCountryGroup: CountriesByCountryGroup;
}>;

const favoriteDataElements = {
    favoriteHomePage1: "fWy88oSclyV",
    favoriteHomePage2: "mLY36VMva42",
    favoriteHomePage3: "Uv1XywZ3dkv",
    favoriteHomePage4: "SQPHJNhoGFD",
    favoriteHomePage5: "Xs6uZ7V5O1q",
    favoriteHomePage6: "XF8EBdyzz3j",
    favoriteComparative1: "BMJyZvepm9L",
    favoriteComparative2: "N0xd0lfL9M3",
    favoriteComparative3: "OxwBHbiMJ7k",
    favoriteComparative4: "MHTn0hoo934",
    favoriteComparative5: "CCMscdrNeCk",
    favoriteComparative6: "vqa4bFR3uX9",
    favoriteMultimedia1: "ivQliVkSBhs",
    favoriteMultimedia2: "sJes3CZZzMd",
    favoriteMultimedia3: "lm2K6GYIYV0",
    favoriteMultimedia4: "vs2eB5LSqIn",
    favoriteMultimedia5: "wOVe8NOjlSZ",
    favoriteMultimedia6: "wSjsjpsw2Kl",
    favoriteNews1: "AXI6jAXa7Vb",
    favoriteNews2: "yBPwYKa1ifk",
    favoriteNews3: "DMzP8pTBo80",
    favoriteNews4: "JZJcxBuRlRg",
    favoriteNews5: "xOyhRba6NOf",
    favoriteNews6: "HNHMXOeNowd",
} as const;

export const resourcesProgram = "wWo0lhm5GsY";
const favoritesProgram = "QD9npLUMvCG";

export class ResourceD2Repository implements ResourceRepository {
    constructor(private api: D2Api) {}

    public get(filters: ResourceFilters): FutureData<Resource[]> {
        const countries = filters.countries ?? [];
        const hasCountriesFilter = countries.length > 0;
        const noCountryGroups: CountriesByCountryGroup = new Map();

        return Future.joinObj({
            favorites: this.getFavoritesResources(),
            countriesByCountryGroup: hasCountriesFilter
                ? this.getCountriesByCountryGroup()
                : Future.success<CountriesByCountryGroup, string>(noCountryGroups),
        }).flatMap(({ favorites, countriesByCountryGroup }) => {
            const favoriteHomeResourcesIds = favorites.homePage.map(favorite => favorite.resourceId);
            const favoriteNewsIds = favorites.news.map(favorite => favorite.resourceId);
            const favoriteResourcesIds = [
                ...favorites.comparativeAnalysis.map(favorite => favorite.resourceId),
                ...favorites.multimedia.map(favorite => favorite.resourceId),
                ...favoriteNewsIds,
            ];

            const favoriteIdsFilter = filters.isFavouriteHome
                ? [...favoriteHomeResourcesIds, ...favoriteNewsIds].join(";")
                : filters.isFavouriteSection
                ? favoriteResourcesIds.join(";")
                : undefined;

            // A resource has a main and a secondary theme, and the events filter cannot match any of
            // two data elements, so the theme is filtered in memory like the countries.
            const hasInMemoryFilter = hasCountriesFilter || Boolean(filters.themeCode);

            //2:38 has a bug filtering events by data element value using eq operator. Like works!
            const filter = _([
                filters.category ? this.getCategoriesFilter(filters.category) : undefined,
                filters.searchTerm ? `${resourceDataElements.title}:like:${filters.searchTerm}` : undefined,
            ])
                .compact()
                .join(",");

            const years = filters.years?.sort();
            const startYear = years ? years[0] : undefined;
            const endYear = years ? years[years.length - 1] : undefined;

            return apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    program: resourcesProgram,
                    startDate: startYear ? `${startYear}-01-01` : undefined,
                    endDate: endYear ? `${endYear}-12-31` : undefined,
                    skipPaging: filters.pageSize && !hasInMemoryFilter ? false : true,
                    pageSize: hasInMemoryFilter ? undefined : filters.pageSize,
                    page: filters.page && !hasInMemoryFilter ? filters.page : 1,
                    filter,
                    order: "eventDate:desc,event:asc",
                    event: favoriteIdsFilter,
                })
            ).flatMap(response => {
                const themeEvents = filters.themeCode
                    ? this.filterThemes(response.events, filters.themeCode)
                    : response.events;
                // With a countries filter resources are never paged, so only the theme filter pages in memory
                const events =
                    filters.themeCode && !hasCountriesFilter ? this.getPage(themeEvents, filters) : themeEvents;
                const countriesFilter = hasCountriesFilter ? { countries, countriesByCountryGroup } : undefined;

                return Future.success(this.buildResources(events, { filters, favorites, countriesFilter }));
            });
        });
    }

    private getCountriesByCountryGroup(): FutureData<CountriesByCountryGroup> {
        return apiToFuture(
            this.api.models.organisationUnitGroups.get({
                fields: orgUnitGroupFields,
                paging: false,
                filter: { id: { in: _.uniq(Object.values(orgUnitGroupByCountryGroup)) } },
            })
        ).map(({ objects: orgUnitGroups }) => {
            const entries = countryGroupCodes.map((code): [CountryGroupCode, ReadonlyArray<Id>] => {
                const orgUnitGroup = orgUnitGroups.find(group => group.id === orgUnitGroupByCountryGroup[code]);
                const groupCountries = (orgUnitGroup?.organisationUnits ?? []).map(({ id }) => getCountryId(id));

                return [code, [...groupCountries, ...(extraCountriesByCountryGroup[code] ?? [])]];
            });

            return new Map(entries);
        });
    }

    private getFavoritesResources(): FutureData<FavoriteResources> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: favoritesProgram,
                order: "eventDate:desc",
            })
        ).map(response => {
            const event = response.events[0];

            if (!event) {
                const emptyFavorites: FavoriteResources = {
                    homePage: [],
                    comparativeAnalysis: [],
                    multimedia: [],
                    news: [],
                };
                return emptyFavorites;
            } else {
                return this.buildFavoritesResources(event);
            }
        });
    }

    private getCategoriesFilter(categoryFilter: string): string | undefined {
        switch (categoryFilter) {
            case "comparative-analysis":
                return `${resourceDataElements.comparativeAnalysisCategory}:eq:true`;
            case "news":
                return `${resourceDataElements.newsCategory}:eq:true`;
            case "multimedia":
                return `${resourceDataElements.multimediaCategory}:eq:true`;
            case "country-analysis":
                return `${resourceDataElements.countryAnalysisCategory}:eq:true`;
            default:
                return undefined;
        }
    }

    private buildResources(
        events: D2Event[],
        options: {
            filters: ResourceFilters;
            favorites: FavoriteResources;
            countriesFilter?: CountriesFilter;
        }
    ): Resource[] {
        const { filters, favorites, countriesFilter } = options;
        const isKindRequested = (kind: Resource["kind"]) => !filters.category || filters.category === kind;

        return _.compact(
            events.flatMap(event => {
                const isComparativeAnalysisCategory =
                    event.dataValues.find(dv => dv.dataElement === resourceDataElements.comparativeAnalysisCategory)
                        ?.value === "true";

                const isNewsCategory =
                    event.dataValues.find(dv => dv.dataElement === resourceDataElements.newsCategory)?.value === "true";

                const isMultimediaCategory =
                    event.dataValues.find(dv => dv.dataElement === resourceDataElements.multimediaCategory)?.value ===
                    "true";

                const isCountryAnalysisCategory =
                    event.dataValues.find(dv => dv.dataElement === resourceDataElements.countryAnalysisCategory)
                        ?.value === "true";

                const mainCountryForCountryAnalysis = event.dataValues.find(
                    dv => dv.dataElement === resourceDataElements.relatedCountry1
                )?.value;

                const isInCountriesFilter =
                    !countriesFilter ||
                    this.getResourceCountries(event, countriesFilter.countriesByCountryGroup).some(country =>
                        countriesFilter.countries.includes(country)
                    );

                // A country analysis belongs only to its main country and ignores the country groups
                const isMainCountryInCountriesFilter =
                    !countriesFilter ||
                    (mainCountryForCountryAnalysis !== undefined &&
                        countriesFilter.countries.includes(mainCountryForCountryAnalysis));

                return [
                    isComparativeAnalysisCategory && isKindRequested("comparative-analysis") && isInCountriesFilter
                        ? this.buildComparativeAnalysis(event, favorites)
                        : undefined,
                    isNewsCategory && isKindRequested("news") && isInCountriesFilter
                        ? this.buildNews(event, favorites)
                        : undefined,
                    isMultimediaCategory && isKindRequested("multimedia") && isInCountriesFilter
                        ? this.buildMultimedia(event, favorites)
                        : undefined,
                    isCountryAnalysisCategory && isKindRequested("country-analysis") && isMainCountryInCountriesFilter
                        ? this.buildCountryAnalysis(event, favorites)
                        : undefined,
                ];
            })
        );
    }

    private buildNews(event: D2Event, favorites: FavoriteResources): News {
        const media = this.buildMedia(event, favorites);
        const favouriteSectionData = this.buildFavouriteSectionByKind(event, "news", favorites);

        return {
            kind: "news",
            ...media,
            ...favouriteSectionData,
        };
    }

    private buildMultimedia(event: D2Event, favorites: FavoriteResources): Multimedia {
        const media = this.buildMedia(event, favorites);

        const favouriteSectionData = this.buildFavouriteSectionByKind(event, "multimedia", favorites);

        return {
            kind: "multimedia",
            ...media,
            ...favouriteSectionData,
            themeCodes: this.getThemeCodes(event),
        };
    }

    private buildMedia(event: D2Event, favorites: FavoriteResources): MediaResource {
        const title = event.dataValues.find(dv => dv.dataElement === resourceDataElements.title)?.value || "";
        const url = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link)?.value || "";

        const favouriteData = this.buildFavouriteHome(event, favorites);

        return {
            id: event.event,
            imageOriginal: `${this.api.baseUrl}/api/events/files?dataElementUid=${resourceDataElements.imageOriginal}&eventUid=${event.event}`,
            imageCustom: `${this.api.baseUrl}/api/events/files?dataElementUid=${resourceDataElements.imageCustom}&eventUid=${event.event}`,
            title,
            url,
            date: new Date(event.eventDate),
            ...favouriteData,
        };
    }

    private buildComparativeAnalysis(event: D2Event, favorites: FavoriteResources): ComparativeAnalysis {
        const analysis = this.buildAnalysis(event, favorites);

        const favouriteSectionData = this.buildFavouriteSectionByKind(event, "comparative-analysis", favorites);

        return {
            kind: "comparative-analysis",
            ...analysis,
            ...favouriteSectionData,
        };
    }

    private buildCountryAnalysis(event: D2Event, favorites: FavoriteResources): CountryAnalysis {
        const analysis = this.buildAnalysis(event, favorites);

        const countryId =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry1)?.value || "";

        const favouriteSectionData = this.buildFavouriteSectionByKind(event, "country-analysis", favorites);

        return {
            kind: "country-analysis",
            ...analysis,
            ...favouriteSectionData,
            countryId,
        };
    }

    private buildAnalysis(event: D2Event, favorites: FavoriteResources): AnalysisResource {
        const title = event.dataValues.find(dv => dv.dataElement === resourceDataElements.title)?.value || "";
        const link = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link)?.value || "";
        const linkLanguage =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.linkLanguage)?.value || "";

        const link2 = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link2)?.value || "";
        const link2Language =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.link2Language)?.value || "";
        const link3 = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link3)?.value || "";
        const link3Language =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.link3Language)?.value || "";
        const link4 = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link4)?.value || "";
        const link4Language =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.link4Language)?.value || "";

        const favouriteData = this.buildFavouriteHome(event, favorites);

        return {
            imageOriginal: `${this.api.baseUrl}/api/events/files?dataElementUid=${resourceDataElements.imageOriginal}&eventUid=${event.event}`,
            imageCustom: `${this.api.baseUrl}/api/events/files?dataElementUid=${resourceDataElements.imageCustom}&eventUid=${event.event}`,
            id: event.event,
            themeCodes: this.getThemeCodes(event),
            links: _([
                this.createLink(link, linkLanguage),
                this.createLink(link2, link2Language),
                this.createLink(link3, link3Language),
                this.createLink(link4, link4Language),
            ])
                .compact()
                .value(),
            title: title,
            date: new Date(event.eventDate),
            ...favouriteData,
        };
    }

    private buildFavouriteHome(
        event: D2Event,
        favorites: FavoriteResources
    ): {
        favouriteHome: boolean;
        favouriteHomeOrder: number;
    } {
        const favorite = favorites.homePage.find(favorite => favorite.resourceId === event.event);

        return {
            favouriteHome: !!favorite,
            favouriteHomeOrder: favorite?.order ?? 0,
        };
    }

    private buildFavouriteSectionByKind(
        event: D2Event,
        kind: "country-analysis" | "comparative-analysis" | "news" | "multimedia",
        favorites: FavoriteResources
    ): {
        favouriteSection: boolean;
        favouriteSectionOrder: number;
    } {
        switch (kind) {
            case "comparative-analysis": {
                const comparativeAnalysisFavorite = favorites.comparativeAnalysis.find(
                    favorite => favorite.resourceId === event.event
                );
                return {
                    favouriteSection: !!comparativeAnalysisFavorite,
                    favouriteSectionOrder: comparativeAnalysisFavorite?.order ?? 0,
                };
            }
            case "news": {
                const newsFavorite = favorites.news.find(favorite => favorite.resourceId === event.event);
                return {
                    favouriteSection: !!newsFavorite,
                    favouriteSectionOrder: newsFavorite?.order ?? 0,
                };
            }
            case "multimedia": {
                const multimediaFavorite = favorites.multimedia.find(favorite => favorite.resourceId === event.event);
                return {
                    favouriteSection: !!multimediaFavorite,
                    favouriteSectionOrder: multimediaFavorite?.order ?? 0,
                };
            }
            default:
                return {
                    favouriteSection: false,
                    favouriteSectionOrder: 0,
                };
        }
    }

    private getResourceCountries(event: D2Event, countriesByCountryGroup: CountriesByCountryGroup): ReadonlyArray<Id> {
        const countryGroups = this.getCountryGroups(event);

        // A selected country group overrules the countries set one by one
        return countryGroups.length > 0
            ? countryGroups.flatMap(code => countriesByCountryGroup.get(code) ?? [])
            : this.getRelatedCountries(event);
    }

    private getCountryGroups(event: D2Event): ReadonlyArray<CountryGroupCode> {
        const value = event.dataValues.find(dv => dv.dataElement === resourceDataElements.countryGroup)?.value ?? "";

        return _.compact(value.split(",").map(option => countryGroupCodes.find(code => code === option)));
    }

    private filterThemes(events: D2Event[], themeCode: string): D2Event[] {
        return events.filter(event => this.getThemeCodes(event).includes(themeCode));
    }

    private getPage(events: D2Event[], filters: ResourceFilters): D2Event[] {
        if (!filters.pageSize) return events;

        const start = ((filters.page ?? 1) - 1) * filters.pageSize;
        return events.slice(start, start + filters.pageSize);
    }

    private getThemeCodes(event: D2Event): string[] {
        const themeCodes = [resourceDataElements.theme, resourceDataElements.themeSecondary].map(
            dataElement => event.dataValues.find(dv => dv.dataElement === dataElement)?.value || ""
        );

        return _(themeCodes).compact().uniq().value();
    }

    private createLink(link?: string, language?: string) {
        return link ? { url: link, language: language || "English" } : undefined;
    }

    private getRelatedCountries(event: D2Event): string[] {
        return _.compact(
            relatedCountryDataElements.map(
                dataElement => event.dataValues.find(dv => dv.dataElement === dataElement)?.value
            )
        );
    }

    private buildFavoritesResources(event: D2Event): FavoriteResources {
        const favoriteHomePage1 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteHomePage1)?.value || "";
        const favoriteHomePage2 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteHomePage2)?.value || "";
        const favoriteHomePage3 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteHomePage3)?.value || "";
        const favoriteHomePage4 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteHomePage4)?.value || "";
        const favoriteHomePage5 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteHomePage5)?.value || "";
        const favoriteHomePage6 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteHomePage6)?.value || "";
        const favoriteComparative1 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteComparative1)?.value || "";
        const favoriteComparative2 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteComparative2)?.value || "";
        const favoriteComparative3 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteComparative3)?.value || "";
        const favoriteComparative4 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteComparative4)?.value || "";
        const favoriteComparative5 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteComparative5)?.value || "";
        const favoriteComparative6 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteComparative6)?.value || "";
        const favoriteMultimedia1 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteMultimedia1)?.value || "";
        const favoriteMultimedia2 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteMultimedia2)?.value || "";
        const favoriteMultimedia3 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteMultimedia3)?.value || "";
        const favoriteMultimedia4 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteMultimedia4)?.value || "";
        const favoriteMultimedia5 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteMultimedia5)?.value || "";
        const favoriteMultimedia6 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteMultimedia6)?.value || "";
        const favoriteNews1 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteNews1)?.value || "";
        const favoriteNews2 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteNews2)?.value || "";
        const favoriteNews3 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteNews3)?.value || "";
        const favoriteNews4 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteNews4)?.value || "";
        const favoriteNews5 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteNews5)?.value || "";
        const favoriteNews6 =
            event.dataValues.find(dv => dv.dataElement === favoriteDataElements.favoriteNews6)?.value || "";
        return {
            homePage: [
                favoriteHomePage1
                    ? {
                          resourceId: favoriteHomePage1,
                          order: 1,
                      }
                    : undefined,
                favoriteHomePage2
                    ? {
                          resourceId: favoriteHomePage2,
                          order: 2,
                      }
                    : undefined,
                favoriteHomePage3
                    ? {
                          resourceId: favoriteHomePage3,
                          order: 3,
                      }
                    : undefined,
                favoriteHomePage4
                    ? {
                          resourceId: favoriteHomePage4,
                          order: 4,
                      }
                    : undefined,
                favoriteHomePage5
                    ? {
                          resourceId: favoriteHomePage5,
                          order: 5,
                      }
                    : undefined,
                favoriteHomePage6
                    ? {
                          resourceId: favoriteHomePage6,
                          order: 6,
                      }
                    : undefined,
            ].filter((item): item is FavoriteResource => Boolean(item)),
            comparativeAnalysis: [
                favoriteComparative1
                    ? {
                          resourceId: favoriteComparative1,
                          order: 1,
                      }
                    : undefined,
                favoriteComparative2
                    ? {
                          resourceId: favoriteComparative2,
                          order: 2,
                      }
                    : undefined,
                favoriteComparative3
                    ? {
                          resourceId: favoriteComparative3,
                          order: 3,
                      }
                    : undefined,
                favoriteComparative4
                    ? {
                          resourceId: favoriteComparative4,
                          order: 4,
                      }
                    : undefined,
                favoriteComparative5
                    ? {
                          resourceId: favoriteComparative5,
                          order: 5,
                      }
                    : undefined,
                favoriteComparative6
                    ? {
                          resourceId: favoriteComparative6,
                          order: 6,
                      }
                    : undefined,
            ].filter((item): item is FavoriteResource => Boolean(item)),
            multimedia: [
                favoriteMultimedia1
                    ? {
                          resourceId: favoriteMultimedia1,
                          order: 1,
                      }
                    : undefined,
                favoriteMultimedia2
                    ? {
                          resourceId: favoriteMultimedia2,
                          order: 2,
                      }
                    : undefined,
                favoriteMultimedia3
                    ? {
                          resourceId: favoriteMultimedia3,
                          order: 3,
                      }
                    : undefined,
                favoriteMultimedia4
                    ? {
                          resourceId: favoriteMultimedia4,
                          order: 4,
                      }
                    : undefined,
                favoriteMultimedia5
                    ? {
                          resourceId: favoriteMultimedia5,
                          order: 5,
                      }
                    : undefined,
                favoriteMultimedia6
                    ? {
                          resourceId: favoriteMultimedia6,
                          order: 6,
                      }
                    : undefined,
            ].filter((item): item is FavoriteResource => Boolean(item)),
            news: [
                favoriteNews1
                    ? {
                          resourceId: favoriteNews1,
                          order: 1,
                      }
                    : undefined,
                favoriteNews2
                    ? {
                          resourceId: favoriteNews2,
                          order: 2,
                      }
                    : undefined,
                favoriteNews3
                    ? {
                          resourceId: favoriteNews3,
                          order: 3,
                      }
                    : undefined,
                favoriteNews4
                    ? {
                          resourceId: favoriteNews4,
                          order: 4,
                      }
                    : undefined,
                favoriteNews5
                    ? {
                          resourceId: favoriteNews5,
                          order: 5,
                      }
                    : undefined,
                favoriteNews6
                    ? {
                          resourceId: favoriteNews6,
                          order: 6,
                      }
                    : undefined,
            ].filter((item): item is FavoriteResource => Boolean(item)),
        };
    }
}

const orgUnitGroupFields = {
    id: true,
    organisationUnits: { id: true },
} as const;

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

export interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}

type FavoriteResource = {
    resourceId: Id;
    order: number;
};

export type FavoriteResources = {
    homePage: FavoriteResource[];
    comparativeAnalysis: FavoriteResource[];
    multimedia: FavoriteResource[];
    news: FavoriteResource[];
};
