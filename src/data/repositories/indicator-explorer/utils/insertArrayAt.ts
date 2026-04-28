export function insertArrayAt<T>(arr: T[], index: number, value: T): T[] {
    return [...arr.slice(0, index), value, ...arr.slice(index)];
}
