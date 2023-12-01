export type PolicyExplorerCategory = {
    id: string;
    name: string;
    subcategories: PolicyExplorerSubcategory[];
    description: string;
};

export type PolicyExplorerSubcategory = {
    id: string;
    name: string;
};
