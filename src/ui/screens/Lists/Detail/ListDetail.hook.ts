import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UpdateListDto } from "@/core/interfaces/repositories/IListsRepository";
import { useListsStore } from "@/ui/stores/Lists.store";
import { getDateTime } from "@/ui/utils";
import type {
	ListDetailState,
	ListProductsState,
	ProductsFilter,
} from "./ListDetail.types";

const PERCENTAGE_MULTIPLIER = 100;

export const useListDetails = (listId: string) => {
	const router = useRouter();

	const [state, setState] = useState<ListDetailState>({
		updating: false,
		deleting: false,
	});

	const list = useListsStore((state) => state.currentList);
	const loadingState = useListsStore((state) => state.state);
	const error = useListsStore((state) => state.error);

	const loadList = useListsStore((state) => state.loadList);
	const updateListAction = useListsStore((state) => state.updateList);
	const deleteListAction = useListsStore((state) => state.deleteList);
	const incrementUsageAction = useListsStore((state) => state.incrementUsage);
	const clearErrorAction = useListsStore((state) => state.clearError);

	const updateList = useCallback(
		async (data: UpdateListDto) => {
			setState((prev) => ({ ...prev, updating: true }));

			try {
				await updateListAction(listId, data);
				await loadList(listId);

				setState((prev) => ({ ...prev, updating: false }));

				return true;
			} catch {
				setState((prev) => ({ ...prev, updating: false }));
				return false;
			}
		},
		[listId, updateListAction, loadList],
	);

	const deleteList = useCallback(async () => {
		setState((prev) => ({ ...prev, deleting: true }));

		try {
			await deleteListAction(listId);
			setState((prev) => ({ ...prev, deleting: false }));

			router.back();

			return true;
		} catch {
			setState((prev) => ({ ...prev, deleting: false }));
			return false;
		}
	}, [listId, router, deleteListAction]);

	const incrementUsage = useCallback(async () => {
		try {
			await incrementUsageAction(listId);
			await loadList(listId);
		} catch {}
	}, [listId, incrementUsageAction, loadList]);

	const toggleActive = useCallback(async () => {
		if (!list) return false;

		return updateList({ isActive: !list.isActive });
	}, [list, updateList]);

	const clearError = useCallback(() => {
		clearErrorAction();
	}, [clearErrorAction]);

	const loading = useMemo(() => loadingState === "loading", [loadingState]);

	const headerSubTitle = useMemo(() => {
		if (!list) return "";
		return `Criado em ${getDateTime(list.createdAt)?.date} às ${getDateTime(list.createdAt)?.time}`;
	}, [list]);

	useEffect(() => {
		loadList(listId);
	}, [listId, loadList]);
	return {
		list,
		loading,
		error,
		updating: state.updating,
		deleting: state.deleting,
		updateList,
		deleteList,
		incrementUsage,
		toggleActive,
		clearError,
		headerSubTitle,
	};
};

export const useListProducts = (listId: string) => {
	const [state, setState] = useState<ListProductsState>({
		adding: false,
		removing: null,
		updating: null,
		marking: null,
		filter: "all",
	});

	const allProducts = useListsStore((state) => state.currentProducts);
	const loadingState = useListsStore((state) => state.state);
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
	const hasProducts = totalProducts > 0;
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
		hasProducts,
	};
};
