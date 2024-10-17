import { getRoundedMaxValue } from "../getMaxAxisAndTickInterval";

describe("getRoundedMaxValue", () => {
    test("should round values <= 100 to the next multiple of 5", () => {
        expect(getRoundedMaxValue(51)).toBe(55);
        expect(getRoundedMaxValue(27)).toBe(30);
        expect(getRoundedMaxValue(100)).toBe(100);
        expect(getRoundedMaxValue(99)).toBe(100);
    });

    test("should round values between 101 and 1000 to the next value ending in 00", () => {
        expect(getRoundedMaxValue(347)).toBe(400);
        expect(getRoundedMaxValue(500)).toBe(500);
        expect(getRoundedMaxValue(780)).toBe(800);
        expect(getRoundedMaxValue(999)).toBe(1000);
    });

    test("should round values between 1001 and 10000 to the next value ending in 000", () => {
        expect(getRoundedMaxValue(1234)).toBe(2000);
        expect(getRoundedMaxValue(5432)).toBe(6000);
        expect(getRoundedMaxValue(6832)).toBe(7000);
        expect(getRoundedMaxValue(9999)).toBe(10000);
    });

    test("should round values between 10001 and 100000 to the next value ending in 0000", () => {
        expect(getRoundedMaxValue(12345)).toBe(20000);
        expect(getRoundedMaxValue(27000)).toBe(30000);
        expect(getRoundedMaxValue(67890)).toBe(70000);
        expect(getRoundedMaxValue(98765)).toBe(100000);
    });

    test("should round values between 100001 and 1000000 to the next value ending in 00000", () => {
        expect(getRoundedMaxValue(123485)).toBe(200000);
        expect(getRoundedMaxValue(270050)).toBe(300000);
        expect(getRoundedMaxValue(678390)).toBe(700000);
        expect(getRoundedMaxValue(989765)).toBe(1000000);
    });

    test("should correctly round edge values", () => {
        expect(getRoundedMaxValue(100)).toBe(100);
        expect(getRoundedMaxValue(1000)).toBe(1000);
        expect(getRoundedMaxValue(10000)).toBe(10000);
        expect(getRoundedMaxValue(100000)).toBe(100000);
        expect(getRoundedMaxValue(1000000)).toBe(1000000);
    });
});
