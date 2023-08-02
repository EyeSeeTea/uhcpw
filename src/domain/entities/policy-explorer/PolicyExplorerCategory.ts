export type PolicyExplorerCategory = {
    id: string;
    name: string;
    subcategories: PolicyExplorerSubcategory[];
};

export type PolicyExplorerSubcategory = {
    id: string;
    name: string;
};
