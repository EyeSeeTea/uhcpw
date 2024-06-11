import { TreeOption } from "../TreeSelector";

export const countries: TreeOption[] = [
    {
        id: "BVnpk4xiXGJ",
        name: "China",
        parents: [
            { id: "1", name: "All countries and areas" },
            { id: "2", name: "Asia" },
        ],
    },
    {
        id: "AVnpk4xiXGJ",
        name: "France",
        parents: [
            { id: "1", name: "All countries and areas" },
            { id: "3", name: "Europe" },
        ],
    },
    {
        id: "DVnpk4xiXGJ",
        name: "Spain",
        parents: [
            { id: "1", name: "All countries and areas" },
            { id: "3", name: "Europe" },
        ],
    },
    {
        id: "IZy3ESdFnp5",
        name: "EU27",
        parents: [],
    },
];

/**
 *  Expected tree
 *
 *  - All countries and areas
 *      China
 *      France
 *      Spain
 *  - Asia
 *      China
 *  - Europe
 *      France
 *      Spain
 *    EU27
 *
 *
 */
