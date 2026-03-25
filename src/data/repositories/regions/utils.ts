import { Id } from "../../../domain/entities/Ref";
import {
    isRegionCodeKey,
    isRegionNameKey,
    REGION_CODES,
    REGION_NAMES,
    RegionCodeKey,
    RegionNameKey,
} from "../../../domain/entities/region/Region";

export function getKeyById<T extends Record<string, string>>(id: string, idsRecord: T): keyof T | undefined {
    return Object.entries(idsRecord).find(([, value]) => value === id)?.[0] as keyof T | undefined;
}

export function getRegionCodeById(idsRecord: Partial<Record<RegionCodeKey, Id>>): Map<Id, string> {
    return new Map(
        Object.entries(idsRecord).reduce<[Id, string][]>(
            (acc, [key, id]) => (id && isRegionCodeKey(key) ? [...acc, [id, REGION_CODES[key]]] : acc),
            []
        )
    );
}

export function getRegionNameById(idsRecord: Partial<Record<RegionNameKey, Id>>): Map<Id, string> {
    return new Map(
        Object.entries(idsRecord).reduce<[Id, string][]>(
            (acc, [key, id]) => (id && isRegionNameKey(key) ? [...acc, [id, REGION_NAMES[key]]] : acc),
            []
        )
    );
}
