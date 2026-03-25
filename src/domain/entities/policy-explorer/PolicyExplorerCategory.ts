export type PolicyExplorerCategory = PolicyExplorerSelectableCategory | PolicyExplorerGroupCategory;

export type PolicyExplorerSelectableCategory = {
    type: "selectable";
    id: string;
    name: string;
    subcategories: PolicyExplorerSubcategory[];
    description: string;
};

export type PolicyExplorerGroupCategory = {
    type: "group";
    id: string;
    name: string;
    categories: PolicyExplorerSelectableCategory[];
    description?: string;
};

export type PolicyExplorerSubcategory = {
    id: string;
    name: string;
};

export type PolicyExplorerSelectCategoryInfo = {
    title: string;
    text: string;
};
