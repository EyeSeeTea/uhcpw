import { Future } from "../../entities/Future";
import { DataSetRepository } from "../../repositories/metadata/DataSetRepository";
import { GetPolicyExplorerYearsUseCase } from "../GetPolicyExplorerYearsUseCase";
import { anything, instance, mock, when } from "ts-mockito";
import { DataSetD2Repository } from "../../../data/repositories/DataSetD2Repository";

describe("Get Policy Explorer Years", () => {
    it("should return current 5 years previous to current if future open periods are zero", async () => {
        const useCase = givenADataSetWithFutureOpenPeriods(0);

        const response = await useCase.execute().runAsync();
        const years = response.data || [];

        expect(years[0]?.id).toBe(getYearFromCurrent(-1));
    });
    it("should return current 5 years previous to current if future open periods are zero", async () => {
        const useCase = givenADataSetWithFutureOpenPeriods(5);

        const response = await useCase.execute().runAsync();
        const years = response.data || [];

        expect(years[0]?.id).toBe(getYearFromCurrent(4));
    });
});

function givenADataSetWithFutureOpenPeriods(openFuturePeriods: number): GetPolicyExplorerYearsUseCase {
    const mockedRepository: DataSetRepository = mock(DataSetD2Repository);

    when(mockedRepository.getById(anything())).thenReturn(
        Future.success({ id: "fakeId", name: "fakeName", openFuturePeriods })
    );

    return new GetPolicyExplorerYearsUseCase(instance(mockedRepository));
}

function getYearFromCurrent(number: number): string {
    return (new Date().getFullYear() + number).toString();
}
