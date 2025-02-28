import _ from "lodash";

export function isObjectEmpty<T extends object>(
    obj: T,
    options?: {
        excludeProps?: (keyof T)[];
        props?: (keyof T)[];
    }
): boolean {
    const { excludeProps = [], props = [] } = options || {};
    const filteredObj = _(obj)
        .pick(props.length > 0 ? props : _.keys(obj))
        .omit(excludeProps)
        .value();

    return _.every(filteredObj, _.isEmpty);
}
