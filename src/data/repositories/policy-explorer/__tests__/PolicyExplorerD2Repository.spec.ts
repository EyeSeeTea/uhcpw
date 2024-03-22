import { getD2APiFromInstance } from "../../../../utils/d2-api";
import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import { PolicyExplorerD2Repository } from "../PolicyExplorerD2Repository";
import policyExplorerDataSet from "./data/policyExplorerDataSet.json";
import orgUnits from "./data/orgUnits.json";
import dataValuesSimple from "./data/dataValuesSimple.json";
import dataValuesEmpty from "./data/dataValuesEmpty.json";
import dataValuesMoreThanOneCategory from "./data/dataValuesMoreThanOneCategory.json";
import dataValuesSimpleMultiplePeriods from "./data/dataValuesSimpleMultiplePeriods.json";
import dataValuesByTypeOfHealthcare from "./data/dataValuesByTypeOfHealthcare.json";
import dataValuesMoreThanOneCountry from "./data/dataValuesMoreThanOneCountry.json";
import dataValuesWithoutOneSubcategory from "./data/dataValuesWithoutOneSubcategory.json";
import policyExplorerResponseSimple from "./data/policyExplorerResponseSimple.json";
import policyExplorerResponseWithMoreThanOneTable from "./data/policyExplorerResponseWithMoreThanOneTable.json";
import policyExplorerResponseWithMultiplePeriods from "./data/policyExplorerResponseWithMultiplePeriods.json";
import policyExplorerResponseByTypeOfHealthcare from "./data/policyExplorerResponseByTypeOfHealthcare.json";
import policyExplorerResponseMoreThanOneCountry from "./data/policyExplorerResponseMoreThanOneCountry.json";
import policyExplorerResponseWithoutOneSubcategory from "./data/policyExplorerResponseWithoutOneSubcategory.json";

import {
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerCellType,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";

const mockWebServer = new MockWebServer();
const api = getD2APiFromInstance(new Instance({ url: "/" }));
const policyExplorerRepository = new PolicyExplorerD2Repository(api);

const GAPS_IN_COVERAGE_SIMPLE_CATEGORY = {
    e6cfI6vWYEF: ["Oc0RJz88pBV", "Cqe4z39igTX", "CCIzcBhaqCZ"],
};

const GAPS_IN_COVERAGE_WITHOUT_SUBCATEGORY = {
    e6cfI6vWYEF: ["Cqe4z39igTX", "CCIzcBhaqCZ"],
};

const GAPS_IN_COVERAGE_YEARS = {
    e6cfI6vWYEF: ["2023"],
};

const SPAIN_COUNTRY = "DVnpk4xiXGJ";
const BELGIUM_COUNTRY = "DVnpk4xiXGJ";

const TWO_CATEGORIES = {
    e6cfI6vWYEF: ["Oc0RJz88pBV", "Cqe4z39igTX", "CCIzcBhaqCZ"],
    Dg4b8bTfEIr: [
        "AFxIxVuvvsZ",
        "JMYOe9wMIoE",
        "FKBHFNqiFM4",
        "fgsOChZT1Yp",
        "qJ9dWNT1HU1",
        "IjpUXUVF9bn",
        "dfWsuiDvDlR",
        "AZgRUJmVPNi",
        "M90TwNwsXjY",
        "rxDjH7GshzX",
        "Soj201VJFWL",
        "tdlh9Z0uktG",
        "jq0sGqVVTNW",
        "XZbHFY1652W",
        "BYbKtpEB0Hn",
        "JfqWVc1eCJl",
        "PyBU3BkN3oQ",
        "zvBP5xebI2D",
        "b5kKyrRkcHG",
        "L9klgnq75d8",
        "xP4nCc5rpV4",
        "mQYv2QxdflF",
        "peIML3XRBaN",
        "CUSj5kPkJ0W",
        "mdnjNf5baYj",
    ],
};

const TWO_CATEGORIES_YEARS = {
    e6cfI6vWYEF: ["2023"],
    Dg4b8bTfEIr: ["2020", "2021", "2022", "2023"],
};

const EMPTY_CATEGORY = {
    FtRwT2aBET4: [
        "KDsEXYarBTu",
        "ewpOQ5y97nj",
        "hDGqtzIFTAg",
        "Ed553tXFkcC",
        "G90HxQdY44N",
        "gOtySPsOkmn",
        "ueyZG15lJNe",
        "oR85dLJrBWB",
        "GMqwcTkBm5u",
        "GwYOC7auTo3",
        "CnlZeapVRTA",
        "Dg9FyroZ53d",
        "Ak3h87SXFws",
        "OAFiKkIj9AV",
        "VqZfgxa6KhX",
        "u50ywFZ6gum",
        "pnUIywtp441",
        "fVrKY8v7ZRy",
        "xZjl72SoX34",
        "RPDIUoT8kU7",
    ],
};

const EMPTY_CATEGORY_YEARS = {
    FtRwT2aBET4: [
        "2000",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
    ],
};

const CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY = {
    Dg4b8bTfEIr: [
        "AFxIxVuvvsZ",
        "JMYOe9wMIoE",
        "FKBHFNqiFM4",
        "fgsOChZT1Yp",
        "qJ9dWNT1HU1",
        "IjpUXUVF9bn",
        "dfWsuiDvDlR",
        "AZgRUJmVPNi",
        "M90TwNwsXjY",
        "rxDjH7GshzX",
        "Soj201VJFWL",
        "tdlh9Z0uktG",
        "jq0sGqVVTNW",
        "XZbHFY1652W",
        "BYbKtpEB0Hn",
        "JfqWVc1eCJl",
        "PyBU3BkN3oQ",
        "zvBP5xebI2D",
        "b5kKyrRkcHG",
        "L9klgnq75d8",
        "xP4nCc5rpV4",
        "mQYv2QxdflF",
        "peIML3XRBaN",
        "CUSj5kPkJ0W",
        "mdnjNf5baYj",
    ],
};

const CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY_YEARS = {
    Dg4b8bTfEIr: ["2020", "2021", "2022", "2023"],
};

const USER_CHARGES_BY_TYPE_OF_HEALTHCARE_CATEGORY = {
    u800TAhsIBY: [
        "mTB12rvpJWd",
        "giUCPiCe745",
        "b29bW9mc9C7",
        "tu36CFgEoh8",
        "mSgmJhjn4Bi",
        "wDQRlBezRAs",
        "SWX96A7gnpA",
        "ZkElvtoVJSd",
        "zsiuJlUSvAW",
        "o6d3FfwRVj7",
        "ibq7wtqnsns",
        "WTtArv6Xvsy",
        "n8jFYyMKDaV",
        "SiNpgO1L5bG",
        "sASANfdEGUR",
        "EruJIoPKO1s",
        "gMAYqfQ5xAD",
        "KBW3D8lOlpg",
        "a67cjmP423S",
        "sk9g2PsK7vD",
        "KfHkuuRZdBh",
        "NJ8zBQdwnd2",
        "lj174orsYYW",
        "eRfuZtUFbPK",
        "Ut93noOXsdK",
        "CpMWBaXJ91P",
        "VroSbngmebX",
        "P7qWfL7oluy",
        "yhSc51DOubT",
        "olgegohqR8l",
        "L2sCkhEbSfM",
        "OjTsewAuevP",
        "NkHvpG471tm",
        "Cm6ngZTrVQR",
        "JLSGrrzqrW9",
        "PUXn0hz2JFX",
        "rZlHlitEiFp",
        "lXBWfAv1EJE",
        "M228fF4qKsx",
        "wZ9JynvumSQ",
        "Py0PrMRPlUj",
        "RtLyOZpUtqO",
        "Bwx3a0w5orN",
        "KQVn9LNZPlq",
        "SINKYu3EMgX",
        "TaS7d80ciTe",
        "syr5O2Mj2vL",
        "Urb1llvnJV4",
        "Ai7ziQeOU53",
        "L6ly0Y1uCe2",
    ],
};

const USER_CHARGES_BY_TYPE_OF_HEALTHCARE_CATEGORY_YEARS = {
    u800TAhsIBY: ["2023"],
};

describe("Given Policy Explorer repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    describe("When get one category Gaps in coverage policy explorer category with country Spain", () => {
        it("Then should request with correct param orgUnit", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesSimple();
            givenOrgUnits();

            await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_SIMPLE_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            if (!mockWebServer?.allRequests?.length) throw new Error(`Request failed`);
            const indexDataValuesLastRequest = mockWebServer?.allRequests?.length - 2;
            const dataValuesRequest = mockWebServer?.allRequests[indexDataValuesLastRequest];

            expect(dataValuesRequest?.params.get("orgUnit")).toBe(SPAIN_COUNTRY);
        });
        it("Then should request with correct param period", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesSimple();
            givenOrgUnits();

            await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_SIMPLE_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            if (!mockWebServer?.allRequests?.length) throw new Error(`Request failed`);
            const indexDataValuesLastRequest = mockWebServer?.allRequests?.length - 2;
            const dataValuesRequest = mockWebServer?.allRequests[indexDataValuesLastRequest];

            expect(dataValuesRequest?.params.get("period")).toBe("2023");
        });
        it("Then should have table in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesSimple();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_SIMPLE_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse = policyExplorerResponseSimple as unknown as PolicyExplorer;

            verifyPolicyExplorerTotalTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
        it("Then should have corresponding table columns and rows in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesSimple();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_SIMPLE_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse = policyExplorerResponseSimple as unknown as PolicyExplorer;

            verifyPolicyExplorerTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
    });

    describe("When get two policy explorer categories with country Spain", () => {
        it("Then should request with correct param period", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMoreThanOneCategory();
            givenOrgUnits();

            await policyExplorerRepository
                .get(
                    {
                        ...TWO_CATEGORIES,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...TWO_CATEGORIES_YEARS,
                    }
                )
                .runAsync();

            if (!mockWebServer?.allRequests?.length) throw new Error(`Request failed`);
            const indexDataValuesLastRequest = mockWebServer?.allRequests?.length - 2;
            const dataValuesRequest = mockWebServer?.allRequests[indexDataValuesLastRequest];
            const periods = dataValuesRequest?.params.getAll("period");

            expect(periods?.length).toBe(["2020", "2021", "2022", "2023"].length);
            expect(
                ["2020", "2021", "2022", "2023"].every(year =>
                    dataValuesRequest?.params.getAll("period")?.includes(year)
                )
            ).toBe(true);
        });
        it("Then should have two policy explorer categories table in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMoreThanOneCategory();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...TWO_CATEGORIES,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...TWO_CATEGORIES_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse =
                policyExplorerResponseWithMoreThanOneTable as unknown as PolicyExplorer;

            verifyPolicyExplorerTotalTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
        it("Then should have two policy explorer categories table columns and rows in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMoreThanOneCategory();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...TWO_CATEGORIES,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...TWO_CATEGORIES_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse =
                policyExplorerResponseWithMoreThanOneTable as unknown as PolicyExplorer;

            verifyPolicyExplorerTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
    });

    describe("When get an empty policy explorer category with country Spain", () => {
        it("Then should have an empty table in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesEmpty();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...EMPTY_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...EMPTY_CATEGORY_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;

            verifyPolicyExplorerEmptyTable(policyExplorerResponse?.tables);
        });
    });

    describe("When get Changes in coverage policy since 2020 policy explorer category with country Spain", () => {
        it("Then should request with correct param period", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMultiplePeriods();
            givenOrgUnits();

            await policyExplorerRepository
                .get(
                    {
                        ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY_YEARS,
                    }
                )
                .runAsync();

            if (!mockWebServer?.allRequests?.length) throw new Error(`Request failed`);
            const indexDataValuesLastRequest = mockWebServer?.allRequests?.length - 2;
            const dataValuesRequest = mockWebServer?.allRequests[indexDataValuesLastRequest];
            const periods = dataValuesRequest?.params.getAll("period");

            expect(periods?.length).toBe(["2020", "2021", "2022", "2023"].length);
            expect(
                ["2020", "2021", "2022", "2023"].every(year =>
                    dataValuesRequest?.params.getAll("period")?.includes(year)
                )
            ).toBe(true);
        });
        it("Then should have more than one period inside table in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMultiplePeriods();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;

            if (!policyExplorerResponse?.tables["Dg4b8bTfEIr"]) throw new Error(`Request failed`);

            verifyMoreThanOnePeriodData(policyExplorerResponse?.tables["Dg4b8bTfEIr"]);
        });
        it("Then should table have corresponding columns and rows in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMultiplePeriods();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse =
                policyExplorerResponseWithMultiplePeriods as unknown as PolicyExplorer;

            verifyPolicyExplorerTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
    });

    describe("When get User charges (co-payments) by type of health care policy explorer category with country Spain", () => {
        it("Then should table have corresponding columns and rows in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesByTypeOfHealthcare();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...USER_CHARGES_BY_TYPE_OF_HEALTHCARE_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...USER_CHARGES_BY_TYPE_OF_HEALTHCARE_CATEGORY_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse =
                policyExplorerResponseByTypeOfHealthcare as unknown as PolicyExplorer;

            verifyPolicyExplorerTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
        it("Then should have a column with the types of healthcare", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesByTypeOfHealthcare();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...USER_CHARGES_BY_TYPE_OF_HEALTHCARE_CATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...USER_CHARGES_BY_TYPE_OF_HEALTHCARE_CATEGORY_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse = policyExplorerResponseByTypeOfHealthcare?.tables[
                "u800TAhsIBY"
            ] as unknown as PolicyExplorerCell[][];

            if (!policyExplorerResponse?.tables["u800TAhsIBY"]) throw new Error(`Request failed`);

            verifyTypeOfHealthcareColumn(policyExplorerResponse?.tables["u800TAhsIBY"], expectedPolicyExplorerResponse);
        });
    });

    describe("When get one category Gaps in coverage policy explorer category with country Spain and Belgium", () => {
        it("Then should request with correct param orgUnit", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMoreThanOneCountry();
            givenOrgUnits();

            await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_SIMPLE_CATEGORY,
                    },
                    [SPAIN_COUNTRY, BELGIUM_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            if (!mockWebServer?.allRequests?.length) throw new Error(`Request failed`);
            const indexDataValuesLastRequest = mockWebServer?.allRequests?.length - 2;
            const dataValuesRequest = mockWebServer?.allRequests[indexDataValuesLastRequest];
            const orgUnits = dataValuesRequest?.params.getAll("orgUnit");

            expect(orgUnits?.length).toBe([SPAIN_COUNTRY, BELGIUM_COUNTRY].length);
            expect(
                [SPAIN_COUNTRY, BELGIUM_COUNTRY].every(year =>
                    dataValuesRequest?.params.getAll("orgUnit")?.includes(year)
                )
            ).toBe(true);
        });
        it("Then should have more than one country inside table in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMoreThanOneCountry();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_SIMPLE_CATEGORY,
                    },
                    [SPAIN_COUNTRY, BELGIUM_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;

            if (!policyExplorerResponse?.tables["e6cfI6vWYEF"]) throw new Error(`Request failed`);

            verifyMoreThanOneCountryData(policyExplorerResponse?.tables["e6cfI6vWYEF"]);
        });
        it("Then should have corresponding table columns and rows in response", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesMoreThanOneCountry();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_SIMPLE_CATEGORY,
                    },
                    [SPAIN_COUNTRY, BELGIUM_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse =
                policyExplorerResponseMoreThanOneCountry as unknown as PolicyExplorer;

            verifyPolicyExplorerTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
    });

    describe("When get one category Gaps in coverage policy explorer category without subcategory Population entitlement: Main gaps in publicly financed coverage with country Spain", () => {
        it("Then should not have the subcategory not included", async () => {
            givenAPolicyExplorerDataSet();
            givenDataValuesWithoutOneSubcategory();
            givenOrgUnits();

            const response = await policyExplorerRepository
                .get(
                    {
                        ...GAPS_IN_COVERAGE_WITHOUT_SUBCATEGORY,
                    },
                    [SPAIN_COUNTRY],
                    {
                        ...GAPS_IN_COVERAGE_YEARS,
                    }
                )
                .runAsync();

            const policyExplorerResponse = (response.data || []) as PolicyExplorer;
            const expectedPolicyExplorerResponse =
                policyExplorerResponseWithoutOneSubcategory as unknown as PolicyExplorer;

            verifyPolicyExplorerTables(policyExplorerResponse?.tables, expectedPolicyExplorerResponse.tables);
        });
    });
});

function givenAPolicyExplorerDataSet() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataSets`,
            httpStatusCode: 200,
            response: policyExplorerDataSet,
        },
    ]);
}

function givenOrgUnits() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/organisationUnits`,
            httpStatusCode: 200,
            response: orgUnits,
        },
    ]);
}

function givenDataValuesSimple() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataValueSets`,
            httpStatusCode: 200,
            response: dataValuesSimple,
        },
    ]);
}

function givenDataValuesWithoutOneSubcategory() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataValueSets`,
            httpStatusCode: 200,
            response: dataValuesWithoutOneSubcategory,
        },
    ]);
}

function givenDataValuesMoreThanOneCountry() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataValueSets`,
            httpStatusCode: 200,
            response: dataValuesMoreThanOneCountry,
        },
    ]);
}

function givenDataValuesMultiplePeriods() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataValueSets`,
            httpStatusCode: 200,
            response: dataValuesSimpleMultiplePeriods,
        },
    ]);
}

function givenDataValuesMoreThanOneCategory() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataValueSets`,
            httpStatusCode: 200,
            response: dataValuesMoreThanOneCategory,
        },
    ]);
}

function givenDataValuesEmpty() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataValueSets`,
            httpStatusCode: 200,
            response: dataValuesEmpty,
        },
    ]);
}

function givenDataValuesByTypeOfHealthcare() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataValueSets`,
            httpStatusCode: 200,
            response: dataValuesByTypeOfHealthcare,
        },
    ]);
}

function verifyPolicyExplorerTotalTables(
    tables: Record<string, PolicyExplorerCell[][]>,
    expectedTables: Record<string, PolicyExplorerCell[][]>
) {
    const tableIds = Object.keys(tables);
    const expectedTablesIds = Object.keys(expectedTables);

    expect(tableIds?.length).toBe(expectedTablesIds?.length);
    expect(expectedTablesIds?.every(expectedId => tableIds?.includes(expectedId))).toBe(true);
}

function verifyPolicyExplorerEmptyTable(tables: Record<string, PolicyExplorerCell[][]>) {
    if (!tables) fail("Table is undefined");
    Object.keys(tables).forEach(tableId => {
        const table = tables[tableId] as PolicyExplorerCell[][];

        expect(table?.length).toBe(0);
    });
}

function verifyPolicyExplorerTables(
    tables: Record<string, PolicyExplorerCell[][]>,
    expectedTables: Record<string, PolicyExplorerCell[][]>
) {
    if (!tables) fail("Table is undefined");
    Object.keys(tables).forEach(tableId => {
        const table = tables[tableId] as PolicyExplorerCell[][];
        const expected = expectedTables[tableId] as PolicyExplorerCell[][];
        const columns = table[0] as PolicyExplorerCell[];
        const expectedColumns = expected[0] as PolicyExplorerCell[];

        verifyPolicyExplorerTableHeaderColumns(columns, expectedColumns);
        verifyPolicyExplorerTableRows(table, expected);
    });
}

function verifyPolicyExplorerTableHeaderColumns(
    columnsHeaders: PolicyExplorerCell[],
    expectedColumnsHeaders: PolicyExplorerCell[]
) {
    columnsHeaders.forEach((columnsHeader, index) => {
        const expected = expectedColumnsHeaders[index];

        expect(columnsHeader?.type).toBe(expected?.type);
        expect(columnsHeader?.value).toBe(expected?.value);
    });
}

function verifyPolicyExplorerTableRowValues(row: PolicyExplorerCell[], expectedRow: PolicyExplorerCell[]) {
    row.forEach((row, index) => {
        const expected = expectedRow[index];
        expect(row?.value).toBe(expected?.value);
    });
}

function verifyPolicyExplorerTableRows(rows: PolicyExplorerCell[][], expectedRows: PolicyExplorerCell[][]) {
    rows.forEach((row, index) => {
        const expected = expectedRows[index] as PolicyExplorerCell[];
        verifyPolicyExplorerTableRowValues(row, expected);
    });
}

function verifyMoreThanOnePeriodData(table: PolicyExplorerCell[][]) {
    const periodRowsIndex = table && table[0] ? table[0].findIndex(column => column.value === "Year") : -1;
    if (periodRowsIndex !== -1) {
        const periodColumn = table
            ?.reduce((acc, row) => {
                return row[periodRowsIndex] ? ([...acc, row[periodRowsIndex]] as PolicyExplorerCell[]) : acc;
            }, [])
            .filter(row => row.value !== "Year");
        expect(periodColumn?.length).toBeGreaterThan(1);
    } else {
        throw new Error(`Year column not found`);
    }
}

function verifyMoreThanOneCountryData(table: PolicyExplorerCell[][]) {
    const periodRowsIndex = table && table[0] ? table[0].findIndex(column => column.value === "Country") : -1;
    if (periodRowsIndex !== -1) {
        const periodColumn = table
            ?.reduce((acc, row) => {
                return row[periodRowsIndex] ? ([...acc, row[periodRowsIndex]] as PolicyExplorerCell[]) : acc;
            }, [])
            .filter(row => row.type !== PolicyExplorerCellType.HEADER);
        expect(periodColumn?.length).toBeGreaterThan(1);
    } else {
        throw new Error(`Country column not found`);
    }
}

function getTypeOfHealthcareColumnByPolicyExplorerCategoryId(table: PolicyExplorerCell[][]) {
    const periodRowsIndex =
        table && table[0] ? table[0].findIndex(column => column.value === "Type of health care") : -1;
    if (periodRowsIndex !== -1) {
        return table?.reduce((acc, row) => {
            return row[periodRowsIndex] ? ([...acc, row[periodRowsIndex]] as PolicyExplorerCell[]) : acc;
        }, []);
    } else {
        throw new Error(`Type of healthcare column not found`);
    }
}

function verifyTypeOfHealthcareColumn(table: PolicyExplorerCell[][], expectedTable: PolicyExplorerCell[][]) {
    const typeOfHealthcareColumn = getTypeOfHealthcareColumnByPolicyExplorerCategoryId(table);
    const expectedTypeOfHealthcareColumn = getTypeOfHealthcareColumnByPolicyExplorerCategoryId(expectedTable);

    if (!typeOfHealthcareColumn) {
        throw new Error(`Type of healthcare column not found`);
    }

    typeOfHealthcareColumn.forEach((column, index) => {
        const expected = expectedTypeOfHealthcareColumn[index];
        expect(column?.type).toBe(expected?.type);
        expect(column?.value).toBe(expected?.value);
    });
}
