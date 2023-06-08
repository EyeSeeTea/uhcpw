export function coordinatesFromString(coordinates: string): [number, number] {
    const coordinatesArray = coordinates.replace("[", "").replace("]", "").split(",");
    const longitude = coordinatesArray[0] ? +coordinatesArray[0] : 0;
    const latitude = coordinatesArray[1] ? +coordinatesArray[1] : 0;

    return [longitude, latitude];
}
