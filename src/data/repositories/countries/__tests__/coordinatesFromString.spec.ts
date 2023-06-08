import { coordinatesFromString } from "../coordinatesFromString";

describe("coordinatesFromString", () => {
    it("show return expected coordinates", () => {
        const coordinates = coordinatesFromString("[-1.345,57.983]");

        expect(coordinates).toEqual([-1.345, 57.983]);
    });
    it("show return empty coordinates for invalid coordinates string", () => {
        const coordinates = coordinatesFromString("");

        expect(coordinates).toEqual([0, 0]);
    });
});
