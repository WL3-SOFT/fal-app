import { useCallback, useEffect, useMemo, useState } from "react";
import { useListsStore } from "@/ui/stores/Lists.store";

type ProductsFilter = "all" | "pending" | "purchased";

type LocalState = {
	adding: boolean;
	removing: string | null;
	updating: string | null;
	marking: string | null;
	filter: ProductsFilter;
};

const PERCENTAGE_MULTIPLIER = 100;

export const useListProductsViewModel = (listId: string) => {
	const [state, setState] = useState<LocalState>({
		adding: false,
		removing: null,
		updating: null,
		marking: null,
		filter: "all",
	});

	const allProducts = useListsStore((state) => state.currentProducts);
	const loadingState = useListsStore((state) => state.loadingState);
	const error = useListsStore((state) => state.error);

	const loadProducts = useListsStore((state) => state.loadListProducts);
	const addProductAction = useListsStore((state) => state.addProduct);
	const removeProductAction = useListsStore((state) => state.removeProduct);
	const updateQuantityAction = useListsStore((state) => state.updateQuantity);
	const togglePurchasedAction = useListsStore((state) => state.togglePurchased);
	const clearErrorAction = useListsStore((state) => state.clearError);

	useEffect(() => {
		loadProducts(listId);
	}, [listId, loadProducts]);

	const products = useMemo(() => {
		if (state.filter === "pending") {
			return allProducts.filter((p) => !p.isPurchased);
		}
		if (state.filter === "purchased") {
			return allProducts.filter((p) => p.isPurchased);
		}
		return allProducts;
	}, [allProducts, state.filter]);

	const addProduct = useCallback(
		async (productId: string, quantity: number) => {
			setState((prev) => ({ ...prev, adding: true }));

			try {
				await addProductAction(listId, productId, quantity);
				await loadProducts(listId);
				setState((prev) => ({ ...prev, adding: false }));

				return true;
			} catch {
				setState((prev) => ({ ...prev, adding: false }));
				return false;
			}
		},
		[listId, addProductAction, loadProducts],
	);

	const removeProduct = useCallback(
		async (productId: string) => {
			setState((prev) => ({ ...prev, removing: productId }));

			try {
				await removeProductAction(listId, productId);
				await loadProducts(listId);
				setState((prev) => ({ ...prev, removing: null }));

				return true;
			} catch {
				setState((prev) => ({ ...prev, removing: null }));
				return false;
			}
		},
		[listId, removeProductAction, loadProducts],
	);

	const updateQuantity = useCallback(
		async (productId: string, quantity: number) => {
			setState((prev) => ({ ...prev, updating: productId }));

			try {
				await updateQuantityAction(listId, productId, quantity);
				await loadProducts(listId);
				setState((prev) => ({ ...prev, updating: null }));

				return true;
			} catch {
				setState((prev) => ({ ...prev, updating: null }));
				return false;
			}
		},
		[listId, updateQuantityAction, loadProducts],
	);

	const markAsPurchased = useCallback(
		async (productId: string) => {
			setState((prev) => ({ ...prev, marking: productId }));

			try {
				await togglePurchasedAction(listId, productId);
				await loadProducts(listId);
				setState((prev) => ({ ...prev, marking: null }));

				return true;
			} catch {
				setState((prev) => ({ ...prev, marking: null }));
				return false;
			}
		},
		[listId, togglePurchasedAction, loadProducts],
	);

	const setFilter = useCallback((filter: ProductsFilter) => {
		setState((prev) => ({ ...prev, filter }));
	}, []);

	const clearError = useCallback(() => {
		clearErrorAction();
	}, [clearErrorAction]);

	const loading = loadingState === "loading";

	const totalProducts = allProducts.length;
	const purchasedProducts = allProducts.filter((p) => p.isPurchased).length;
	const pendingProducts = totalProducts - purchasedProducts;
	const progressPercentage =
		totalProducts > 0
			? (purchasedProducts / totalProducts) * PERCENTAGE_MULTIPLIER
			: 0;

	return {
		products,
		loading,
		error,
		adding: state.adding,
		removing: state.removing,
		updating: state.updating,
		marking: state.marking,
		filter: state.filter,
		totalProducts,
		purchasedProducts,
		pendingProducts,
		progressPercentage,
		addProduct,
		removeProduct,
		updateQuantity,
		markAsPurchased,
		setFilter,
		clearError,
	};
};
