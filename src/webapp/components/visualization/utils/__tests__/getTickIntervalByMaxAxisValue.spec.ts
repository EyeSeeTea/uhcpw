import { getTickIntervalByMaxAxisValue } from "../getMaxAxisAndTickInterval";

describe("getTickIntervalByMaxAxisValue", () => {
    it("should return 0.2 when maxAxisValue is less than or equal to 1", () => {
        expect(getTickIntervalByMaxAxisValue(0.5)).toBe(0.2);
        expect(getTickIntervalByMaxAxisValue(1)).toBe(0.2);
    });

    it("should return 1 when maxAxisValue is less than or equal to 5", () => {
        expect(getTickIntervalByMaxAxisValue(2)).toBe(1);
        expect(getTickIntervalByMaxAxisValue(5)).toBe(1);
    });

    it("should return 2 when maxAxisValue is less than or equal to 10", () => {
        expect(getTickIntervalByMaxAxisValue(6)).toBe(2);
        expect(getTickIntervalByMaxAxisValue(10)).toBe(2);
    });

    it("should return baseInterval * 0.4 when maxAxisValue is less than or equal to 2.4 * baseInterval", () => {
        expect(getTickIntervalByMaxAxisValue(15)).toBe(4);
        expect(getTickIntervalByMaxAxisValue(240)).toBe(40);
    });

    it("should return baseInterval * 0.5 when maxAxisValue is less than or equal to 4.5 * baseInterval", () => {
        expect(getTickIntervalByMaxAxisValue(45)).toBe(5);
        expect(getTickIntervalByMaxAxisValue(450)).toBe(50);
    });

    it("should return baseInterval * 1 when maxAxisValue is less than or equal to 8 * baseInterval", () => {
        expect(getTickIntervalByMaxAxisValue(80)).toBe(10);
        expect(getTickIntervalByMaxAxisValue(800)).toBe(100);
    });

    it("should return baseInterval * 1.5 when maxAxisValue is less than or equal to 9 * baseInterval", () => {
        expect(getTickIntervalByMaxAxisValue(90)).toBe(15);
        expect(getTickIntervalByMaxAxisValue(900)).toBe(150);
    });

    it("should return baseInterval * 2 when maxAxisValue is less than or equal to 10 * baseInterval", () => {
        expect(getTickIntervalByMaxAxisValue(100)).toBe(20);
        expect(getTickIntervalByMaxAxisValue(1000)).toBe(200);
    });

    it("should handle larger values of maxAxisValue", () => {
        expect(getTickIntervalByMaxAxisValue(2400)).toBe(400);
        expect(getTickIntervalByMaxAxisValue(4500)).toBe(500);
        expect(getTickIntervalByMaxAxisValue(8000)).toBe(1000);
        expect(getTickIntervalByMaxAxisValue(10000)).toBe(2000);
    });
});
