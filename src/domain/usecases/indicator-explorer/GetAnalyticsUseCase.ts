import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { FutureData } from "../../entities/Future";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";

export class GetAnalyticsUseCase {
    constructor(private analyticsRepository: AnalyticsRepository) {}

    public execute(): FutureData<Analytics> {
        const dimension = [
            "yooLFrJORoj:GuypYXqveWn;ii0MC8x9D7i;O0MXmTdpf4m;GeiKSyJLeKt;yiucIy5NIAw",
            "pe:2006;2007;2008;2009;2010;2011;2012;2013;2014;2015;2016;2017;2018;2019",
        ];
        const filter = ["dx:eEmQgI32ETw,ou:DVnpk4xiXGJ"];

        return this.analyticsRepository.get(dimension, filter);
    }
}
