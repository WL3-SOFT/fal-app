export type ListDetailState = {
	updating: boolean;
	deleting: boolean;
};

export type ProductsFilter = "all" | "pending" | "purchased";

export type ListProductsState = {
	adding: boolean;
	removing: string | null;
	updating: string | null;
	marking: string | null;
	filter: ProductsFilter;
};
